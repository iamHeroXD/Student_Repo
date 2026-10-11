"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { createSessionToken, verifySessionToken } from "./jwt";
import { SESSION_COOKIE_NAME, getCurrentSession, validateUsername } from "./session";
import {
  loadPlatformState,
  savePlatformState,
  appendAuditLog,
  StoredUser,
} from "@/lib/supabase/persistence";

const ADMIN_VAULT_COOKIE = "sr_admin_vault";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface AuthResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

function getAdminPasscodeHash(): string {
  const customPin = process.env.ADMIN_SECURITY_PIN || "SR-ADMIN-2026";
  return crypto.createHash("sha256").update(customPin).digest("hex");
}

export async function isAdminVaultUnlocked(): Promise<boolean> {
  const session = await getCurrentSession();
  if (!session || (session.role !== "admin" && session.role !== "moderator")) {
    return false;
  }
  const cookieStore = await cookies();
  const vaultToken = cookieStore.get(ADMIN_VAULT_COOKIE)?.value;
  if (!vaultToken) return false;

  const expected = crypto
    .createHmac("sha256", process.env.AUTH_SECRET || "fallback-secret")
    .update(`${session.userId}:${session.username}:admin_unlocked`)
    .digest("hex");

  return vaultToken === expected;
}

export async function loginAction(formData: FormData): Promise<AuthResult> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Please provide both username and password." };
  }

  const normalized = username.trim().toLowerCase();

  try {
    const state = await loadPlatformState();
    let targetUser = state.users.find((u) => u.username_normalized === normalized);

    // Also check PostgreSQL auth_credentials if table exists
    try {
      const supabase = getServiceRoleClient();
      const { data: pgCred, error: pgErr } = await supabase
        .from("auth_credentials")
        .select("id, username, password_hash, role, is_active")
        .eq("username_normalized", normalized)
        .maybeSingle();

      if (!pgErr && pgCred) {
        const { data: pgProfile } = await supabase
          .from("profiles")
          .select("full_name, verification_status")
          .eq("id", pgCred.id)
          .maybeSingle();

        targetUser = {
          id: pgCred.id,
          username: pgCred.username,
          username_normalized: normalized,
          password_hash: pgCred.password_hash,
          role: pgCred.role,
          is_active: pgCred.is_active,
          full_name: pgProfile?.full_name || pgCred.username,
          verification_status: pgProfile?.verification_status || "none",
          reputation_score: 50,
          created_at: new Date().toISOString(),
        };
      }
    } catch {
      // Fallback to Supabase Storage state seamlessly
    }

    if (!targetUser || !targetUser.is_active) {
      await appendAuditLog({
        actor_username: normalized,
        actor_role: "anonymous",
        action: "AUTH_LOGIN_FAILED",
        target: "/login",
        status: "warning",
        details: "Unknown or inactive username login attempt",
      });
      return { success: false, error: "Invalid username or password." };
    }

    // Check brute-force lockout
    if (targetUser.locked_until && new Date(targetUser.locked_until).getTime() > Date.now()) {
      const minsLeft = Math.ceil((new Date(targetUser.locked_until).getTime() - Date.now()) / 60000);
      await appendAuditLog({
        actor_username: targetUser.username,
        actor_role: targetUser.role,
        action: "AUTH_LOCKOUT_BLOCKED",
        target: "/login",
        status: "blocked",
        details: `Account temporarily locked (${minsLeft}m remaining)`,
      });
      return {
        success: false,
        error: `Too many failed attempts. Account locked for ${minsLeft} minute(s).`,
      };
    }

    const matches = await bcrypt.compare(password, targetUser.password_hash);
    if (!matches) {
      const idx = state.users.findIndex((u) => u.username_normalized === normalized);
      if (idx !== -1) {
        const attempts = (state.users[idx].failed_attempts || 0) + 1;
        state.users[idx].failed_attempts = attempts;
        if (attempts >= MAX_FAILED_ATTEMPTS) {
          state.users[idx].locked_until = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString();
        }
        await savePlatformState(state);
      }

      await appendAuditLog({
        actor_username: targetUser.username,
        actor_role: targetUser.role,
        action: "AUTH_BAD_PASSWORD",
        target: "/login",
        status: "warning",
        details: "Invalid password supplied",
      });

      return { success: false, error: "Invalid username or password." };
    }

    // Reset failed attempts & record last_login_at
    const idx = state.users.findIndex((u) => u.username_normalized === normalized);
    if (idx !== -1) {
      state.users[idx].failed_attempts = 0;
      state.users[idx].locked_until = null;
      state.users[idx].last_login_at = new Date().toISOString();
      await savePlatformState(state);
    }

    const token = await createSessionToken({
      userId: targetUser.id,
      username: targetUser.username,
      role: targetUser.role,
      verificationStatus: targetUser.verification_status || "none",
      fullName: targetUser.full_name || targetUser.username,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    await appendAuditLog({
      actor_username: targetUser.username,
      actor_role: targetUser.role,
      action: "AUTH_LOGIN_SUCCESS",
      target: targetUser.role === "admin" ? "/admin" : "/dashboard",
      status: "success",
      details: `Signed in as ${targetUser.role}`,
    });

    return {
      success: true,
      redirectTo: targetUser.role === "admin" ? "/admin" : "/dashboard",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Authentication service error";
    return { success: false, error: message };
  }
}

export async function registerAction(formData: FormData): Promise<AuthResult> {
  const username = (formData.get("username") as string)?.trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const fullName = (formData.get("fullName") as string)?.trim() || username;
  const requestedRole = (formData.get("role") as string) || "student";
  const targetClass = formData.get("targetClass") as string;
  const targetStream = formData.get("targetStream") as string;
  const educationBoard = (formData.get("educationBoard") as string) || "kerala-state";
  const institutionName = formData.get("institutionName") as string;

  const validCheck = validateUsername(username);
  if (!validCheck.valid) {
    return { success: false, error: validCheck.error };
  }

  if (!password || password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Passwords do not match." };
  }

  // Strictly prevent privilege escalation: only 'student' or 'teacher' allowed on public signup
  const safeRole: "student" | "teacher" = requestedRole === "teacher" ? "teacher" : "student";
  const normalized = username.toLowerCase();

  try {
    const state = await loadPlatformState();
    const existing = state.users.find((u) => u.username_normalized === normalized);
    if (existing) {
      return { success: false, error: "This username is already taken. Please choose another." };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUserId = crypto.randomUUID();

    const newUser: StoredUser = {
      id: newUserId,
      username,
      username_normalized: normalized,
      password_hash: passwordHash,
      role: safeRole,
      is_active: true,
      full_name: fullName,
      verification_status: "none",
      target_class: targetClass || null,
      target_stream: targetStream || null,
      education_board: educationBoard,
      institution_name: institutionName || null,
      reputation_score: 50,
      created_at: new Date().toISOString(),
      failed_attempts: 0,
    };

    state.users.push(newUser);
    await savePlatformState(state);

    // Also write to PostgreSQL tables if they exist
    try {
      const supabase = getServiceRoleClient();
      await supabase.from("auth_credentials").insert({
        id: newUserId,
        username,
        username_normalized: normalized,
        password_hash: passwordHash,
        role: safeRole,
      });
      await supabase.from("profiles").insert({
        id: newUserId,
        username,
        full_name: fullName,
        role: safeRole,
        verification_status: "none",
        target_class: targetClass || null,
        target_stream: targetStream || null,
        education_board: educationBoard,
        institution_name: institutionName || null,
      });
    } catch {
      // Handled by Supabase Storage persistence state
    }

    const token = await createSessionToken({
      userId: newUser.id,
      username: newUser.username,
      role: newUser.role,
      verificationStatus: "none",
      fullName,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    await appendAuditLog({
      actor_username: newUser.username,
      actor_role: newUser.role,
      action: "USER_REGISTERED",
      target: `/u/${newUser.username}`,
      status: "success",
      details: `Registered new ${newUser.role} account`,
    });

    return {
      success: true,
      redirectTo: safeRole === "teacher" ? "/teacher/verification" : "/dashboard",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration error";
    return { success: false, error: message };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(ADMIN_VAULT_COOKIE);
}

/**
 * Secondary Step-Up Authentication for /admin Vault Unlock
 */
export async function unlockAdminVaultAction(formData: FormData): Promise<AuthResult> {
  const session = await getCurrentSession();
  if (!session || (session.role !== "admin" && session.role !== "moderator")) {
    await appendAuditLog({
      actor_username: session?.username || "anonymous",
      actor_role: session?.role || "none",
      action: "UNAUTHORIZED_ADMIN_UNLOCK_ATTEMPT",
      target: "/admin",
      status: "blocked",
      details: "Non-admin user attempted to unlock Admin Security Vault",
    });
    return { success: false, error: "Unauthorized: Administrator role required." };
  }

  const securityPin = (formData.get("securityPin") as string)?.trim() || "";
  const suppliedHash = crypto.createHash("sha256").update(securityPin).digest("hex");

  if (suppliedHash !== getAdminPasscodeHash()) {
    await appendAuditLog({
      actor_username: session.username,
      actor_role: session.role,
      action: "ADMIN_VAULT_PIN_FAILED",
      target: "/admin",
      status: "blocked",
      details: "Invalid secondary admin security key supplied",
    });
    return { success: false, error: "Invalid Admin Security Key. Access denied and logged." };
  }

  const vaultToken = crypto
    .createHmac("sha256", process.env.AUTH_SECRET || "fallback-secret")
    .update(`${session.userId}:${session.username}:admin_unlocked`)
    .digest("hex");

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_VAULT_COOKIE, vaultToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 30, // Strict 30-minute step-up session
    path: "/",
  });

  await appendAuditLog({
    actor_username: session.username,
    actor_role: session.role,
    action: "ADMIN_VAULT_UNLOCKED",
    target: "/admin",
    status: "success",
    details: "Step-up 2FA security key verified (30m strict session)",
  });

  revalidatePath("/admin");
  return { success: true };
}

export async function lockAdminVaultAction(): Promise<void> {
  const session = await getCurrentSession();
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_VAULT_COOKIE);

  if (session) {
    await appendAuditLog({
      actor_username: session.username,
      actor_role: session.role,
      action: "ADMIN_VAULT_LOCKED",
      target: "/admin",
      status: "success",
      details: "Administrator manually locked the security console",
    });
  }
  revalidatePath("/admin");
}

/**
 * Server-enforced resource moderation action (Approve / Reject)
 */
export async function moderateResourceAction(formData: FormData): Promise<void> {
  const session = await getCurrentSession();
  const unlocked = await isAdminVaultUnlocked();

  if (!session || (session.role !== "admin" && session.role !== "moderator") || !unlocked) {
    await appendAuditLog({
      actor_username: session?.username || "anonymous",
      actor_role: session?.role || "none",
      action: "UNAUTHORIZED_MODERATION_ATTEMPT",
      target: "/admin",
      status: "blocked",
      details: "Attempted resource moderation without unlocked admin session",
    });
    throw new Error("Unauthorized moderation request");
  }

  const resourceId = formData.get("resourceId") as string;
  const newStatus = formData.get("newStatus") as "approved" | "rejected" | "pending_review";

  if (!resourceId || !["approved", "rejected", "pending_review"].includes(newStatus)) {
    return;
  }

  const state = await loadPlatformState();
  // Re-verify admin is still active in DB
  const adminRecord = state.users.find((u) => u.username_normalized === session.username.toLowerCase());
  if (adminRecord && !adminRecord.is_active) {
    throw new Error("Admin account is no longer active");
  }

  state.resourceStatusOverrides[resourceId] = newStatus;
  await savePlatformState(state);

  await appendAuditLog({
    actor_username: session.username,
    actor_role: session.role,
    action: `RESOURCE_${newStatus.toUpperCase()}`,
    target: `resource:${resourceId}`,
    status: "success",
    details: `Changed resource status to ${newStatus}`,
  });

  revalidatePath("/admin");
  revalidatePath("/explore");
  revalidatePath("/");
}
