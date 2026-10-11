"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { createSessionToken } from "./jwt";
import { SESSION_COOKIE_NAME, getCurrentSession, validateUsername } from "./session";
import {
  loadPlatformState,
  savePlatformState,
  appendAuditLog,
  StoredUser,
} from "@/lib/supabase/persistence";
import { Resource } from "@/types";

const ADMIN_VAULT_COOKIE = "sr_admin_vault";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export interface AuthResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
  slug?: string;
  status?: string;
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
    const targetUser = state.users.find((u) => u.username_normalized === normalized);

    if (!targetUser || !targetUser.is_active) {
      await appendAuditLog({
        actor_username: normalized,
        actor_role: "anonymous",
        action: "AUTH_LOGIN_FAILED",
        target: "/login",
        status: "warning",
        details: "Unknown or suspended username login attempt",
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

    const hasStream = targetClass === "plus-one" || targetClass === "plus-two";

    const newUser: StoredUser = {
      id: newUserId,
      username,
      username_normalized: normalized,
      password_hash: passwordHash,
      role: safeRole,
      is_active: true,
      full_name: fullName,
      avatar_url: null,
      verification_status: "none",
      target_class: targetClass || null,
      target_stream: hasStream ? (targetStream || "science") : null,
      education_board: educationBoard,
      institution_name: institutionName || null,
      reputation_score: 10,
      created_at: new Date().toISOString(),
      failed_attempts: 0,
    };

    state.users.push(newUser);
    await savePlatformState(state);

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
 * Real PDF Upload Server Action -> Uploads PDF to Supabase 'resources' bucket & creates Resource record
 */
export async function uploadResourceAction(formData: FormData): Promise<AuthResult> {
  const session = await getCurrentSession();
  if (!session) {
    return { success: false, error: "You must be signed in to upload academic materials." };
  }

  const file = formData.get("file") as File | null;
  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const classId = (formData.get("classId") as string) || "plus-two";
  const rawStreamId = (formData.get("streamId") as string) || "science";
  const streamId = classId === "plus-one" || classId === "plus-two" ? rawStreamId : null;
  const subjectId = (formData.get("subjectId") as string) || `${classId}-general`;
  const resourceTypeId = (formData.get("resourceTypeId") as string) || "notes";
  const language = (formData.get("language") as string) || "English";
  const authorName = (formData.get("authorName") as string)?.trim() || session.fullName;
  const institution = (formData.get("institution") as string)?.trim() || "";
  const pageCount = Math.max(1, parseInt((formData.get("pageCount") as string) || "1", 10) || 1);
  const quickNotes = (formData.get("quickNotes") as string)?.trim() || null;
  const pyqAnalysis = (formData.get("pyqAnalysis") as string)?.trim() || null;
  const examPredictions = (formData.get("examPredictions") as string)?.trim() || null;

  if (!file || file.size === 0) {
    return { success: false, error: "Please select a valid PDF file to upload." };
  }
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { success: false, error: "Only PDF documents (.pdf) are allowed." };
  }
  if (file.size > 25 * 1024 * 1024) {
    return { success: false, error: "File size exceeds the 25 MB maximum limit." };
  }
  if (!title || title.length < 4) {
    return { success: false, error: "Please enter a clear title (at least 4 characters)." };
  }
  if (!description || description.length < 10) {
    return { success: false, error: "Please provide a description of the material." };
  }

  try {
    const state = await loadPlatformState();
    const uploaderUser = state.users.find(
      (u) => u.username_normalized === session.username.toLowerCase()
    );

    if (uploaderUser && !uploaderUser.is_active) {
      return { success: false, error: "Your account is currently suspended from uploading." };
    }

    const resourceId = `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const baseSlug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;
    const storagePath = `uploads/${resourceId}.pdf`;

    // Upload binary PDF to Supabase 'resources' storage bucket
    const supabase = getServiceRoleClient();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadErr } = await supabase.storage
      .from("resources")
      .upload(storagePath, buffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadErr) {
      return { success: false, error: `Storage upload failed: ${uploadErr.message}` };
    }

    // Admins & Moderators auto-approve; others enter pending_review queue
    const initialStatus: Resource["status"] =
      session.role === "admin" || session.role === "moderator"
        ? "approved"
        : "pending_review";

    const newResource: Resource = {
      id: resourceId,
      title,
      slug,
      description,
      board_id: "kerala-state",
      class_id: classId,
      stream_id: streamId,
      subject_id: subjectId,
      resource_type_id: resourceTypeId,
      language,
      download_allowed: true,
      has_answer_key: resourceTypeId === "answer-key" || resourceTypeId === "question-paper",
      storage_path: storagePath,
      file_size_bytes: file.size,
      page_count: pageCount,
      file_type: "application/pdf",
      author_name: authorName,
      school_or_institution: institution || uploaderUser?.institution_name || undefined,
      rights_declaration: "Authorized for open educational use on Student_Repo.",
      quick_notes: quickNotes,
      pyq_analysis: pyqAnalysis,
      exam_predictions: examPredictions,
      uploader_id: session.userId,
      uploader: {
        id: session.userId,
        username: session.username,
        full_name: uploaderUser?.full_name || session.fullName,
        avatar_url: uploaderUser?.avatar_url || null,
        role: uploaderUser?.role || session.role,
        verification_status: uploaderUser?.verification_status || session.verificationStatus,
        reputation_score: uploaderUser?.reputation_score || 10,
        created_at: uploaderUser?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      status: initialStatus,
      views_count: 1,
      preview_opens: 1,
      downloads_count: 0,
      saves_count: 0,
      rating_sum: 0,
      ratings_count: 0,
      helpful_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    state.customResources.unshift(newResource);

    // If auto-approved, reward uploader reputation
    if (initialStatus === "approved" && uploaderUser) {
      uploaderUser.reputation_score = (uploaderUser.reputation_score || 0) + 50;
    }

    await savePlatformState(state);

    await appendAuditLog({
      actor_username: session.username,
      actor_role: session.role,
      action: "RESOURCE_UPLOADED",
      target: `/resource/${slug}`,
      status: "success",
      details: `Uploaded PDF "${title}" (${(file.size / 1024).toFixed(0)} KB) [${initialStatus}]`,
    });

    revalidatePath("/");
    revalidatePath("/explore");
    revalidatePath("/classes");
    revalidatePath(`/class/${classId}`);
    revalidatePath("/question-papers");
    revalidatePath("/dashboard");
    revalidatePath("/admin");
    revalidatePath("/leaderboard");

    return {
      success: true,
      slug,
      status: initialStatus,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return { success: false, error: message };
  }
}

/**
 * Real Star Rating Action (1-5 stars)
 */
export async function rateResourceAction(
  resourceId: string,
  stars: number
): Promise<{ success: boolean; ratingAvg?: string; count?: number; error?: string }> {
  if (stars < 1 || stars > 5) {
    return { success: false, error: "Rating must be between 1 and 5 stars." };
  }

  try {
    const state = await loadPlatformState();
    const res = state.customResources.find((r) => r.id === resourceId);
    if (!res) {
      return { success: false, error: "Resource not found." };
    }

    res.rating_sum = (res.rating_sum || 0) + stars;
    res.ratings_count = (res.ratings_count || 0) + 1;

    // Reward contributor reputation
    const uploader = state.users.find(
      (u) => u.id === res.uploader_id || u.username_normalized === res.uploader?.username.toLowerCase()
    );
    if (uploader) {
      uploader.reputation_score = (uploader.reputation_score || 0) + stars * 5;
    }

    await savePlatformState(state);
    revalidatePath(`/resource/${res.slug}`);
    revalidatePath("/explore");
    revalidatePath("/leaderboard");

    return {
      success: true,
      ratingAvg: (res.rating_sum / res.ratings_count).toFixed(1),
      count: res.ratings_count,
    };
  } catch {
    return { success: false, error: "Could not save rating." };
  }
}

/**
 * Submit Teacher Verification Request
 */
export async function submitTeacherVerificationAction(formData: FormData): Promise<AuthResult> {
  const session = await getCurrentSession();
  if (!session) {
    return { success: false, error: "Please sign in first." };
  }

  const schoolName = (formData.get("schoolName") as string)?.trim();
  const specialization = (formData.get("specialization") as string)?.trim();
  const experienceYears = parseInt((formData.get("experienceYears") as string) || "1", 10) || 1;

  if (!schoolName || !specialization) {
    return { success: false, error: "Please provide both your institution name and specialization." };
  }

  const state = await loadPlatformState();
  const user = state.users.find((u) => u.username_normalized === session.username.toLowerCase());
  if (user) {
    user.verification_status = "pending";
    user.institution_name = schoolName;
  }

  const existingIdx = state.verificationRequests.findIndex(
    (v) => v.username.toLowerCase() === session.username.toLowerCase()
  );

  const reqItem = {
    id: `ver-${Date.now()}`,
    user_id: session.userId,
    username: session.username,
    full_name: user?.full_name || session.fullName,
    school_name: schoolName,
    subject_specialization: specialization,
    experience_years: experienceYears,
    status: "pending" as const,
    created_at: new Date().toISOString(),
  };

  if (existingIdx !== -1) {
    state.verificationRequests[existingIdx] = reqItem;
  } else {
    state.verificationRequests.unshift(reqItem);
  }

  await savePlatformState(state);

  await appendAuditLog({
    actor_username: session.username,
    actor_role: session.role,
    action: "TEACHER_VERIFICATION_REQUESTED",
    target: "/teacher/verification",
    status: "success",
    details: `${schoolName} (${specialization}, ${experienceYears} yrs)`,
  });

  revalidatePath("/teacher/verification");
  revalidatePath("/admin");
  return { success: true };
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
    maxAge: 60 * 30,
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
 * Server-enforced resource moderation action (Approve / Reject / Delete)
 */
export async function moderateResourceAction(formData: FormData): Promise<void> {
  const session = await getCurrentSession();
  const unlocked = await isAdminVaultUnlocked();

  if (!session || (session.role !== "admin" && session.role !== "moderator") || !unlocked) {
    throw new Error("Unauthorized moderation request");
  }

  const resourceId = formData.get("resourceId") as string;
  const newStatus = formData.get("newStatus") as "approved" | "rejected" | "pending_review" | "delete";

  if (!resourceId) return;

  const state = await loadPlatformState();
  const resIdx = state.customResources.findIndex((r) => r.id === resourceId);

  if (newStatus === "delete") {
    if (resIdx !== -1) {
      const removed = state.customResources[resIdx];
      state.customResources.splice(resIdx, 1);
      delete state.resourceStatusOverrides[resourceId];
      try {
        const supabase = getServiceRoleClient();
        await supabase.storage.from("resources").remove([removed.storage_path]);
      } catch {
        // Ignore storage removal errors
      }
      await savePlatformState(state);
      await appendAuditLog({
        actor_username: session.username,
        actor_role: session.role,
        action: "RESOURCE_DELETED",
        target: `resource:${resourceId}`,
        status: "warning",
        details: `Deleted resource "${removed.title}"`,
      });
    }
  } else if (["approved", "rejected", "pending_review"].includes(newStatus)) {
    state.resourceStatusOverrides[resourceId] = newStatus;
    if (resIdx !== -1) {
      const prevStatus = state.customResources[resIdx].status;
      state.customResources[resIdx].status = newStatus;

      // Award +50 reputation points when transitioning to approved
      if (prevStatus !== "approved" && newStatus === "approved") {
        const uploader = state.users.find(
          (u) =>
            u.id === state.customResources[resIdx].uploader_id ||
            u.username_normalized === state.customResources[resIdx].uploader?.username.toLowerCase()
        );
        if (uploader) {
          uploader.reputation_score = (uploader.reputation_score || 0) + 50;
        }
      }
    }
    await savePlatformState(state);

    await appendAuditLog({
      actor_username: session.username,
      actor_role: session.role,
      action: `RESOURCE_${newStatus.toUpperCase()}`,
      target: `resource:${resourceId}`,
      status: "success",
      details: `Changed resource status to ${newStatus}`,
    });
  }

  revalidatePath("/admin");
  revalidatePath("/explore");
  revalidatePath("/classes");
  revalidatePath("/question-papers");
  revalidatePath("/leaderboard");
  revalidatePath("/dashboard");
  revalidatePath("/");
}

/**
 * Admin Teacher Verification Approval / Rejection
 */
export async function reviewTeacherVerificationAction(formData: FormData): Promise<void> {
  const session = await getCurrentSession();
  const unlocked = await isAdminVaultUnlocked();

  if (!session || (session.role !== "admin" && session.role !== "moderator") || !unlocked) {
    throw new Error("Unauthorized verification review");
  }

  const requestId = formData.get("requestId") as string;
  const decision = formData.get("decision") as "verified" | "rejected";

  const state = await loadPlatformState();
  const reqItem = state.verificationRequests.find((r) => r.id === requestId);
  if (!reqItem) return;

  reqItem.status = decision;

  const user = state.users.find(
    (u) => u.username_normalized === reqItem.username.toLowerCase()
  );
  if (user) {
    user.verification_status = decision;
    if (decision === "verified") {
      user.role = "teacher";
      user.reputation_score = (user.reputation_score || 0) + 100;
    }
  }

  // Also update uploader badge on any resources uploaded by this user
  for (const res of state.customResources) {
    if (res.uploader && res.uploader.username.toLowerCase() === reqItem.username.toLowerCase()) {
      res.uploader.verification_status = decision;
      if (decision === "verified") res.uploader.role = "teacher";
    }
  }

  await savePlatformState(state);

  await appendAuditLog({
    actor_username: session.username,
    actor_role: session.role,
    action: `TEACHER_VERIFICATION_${decision.toUpperCase()}`,
    target: `@${reqItem.username}`,
    status: "success",
    details: `${decision === "verified" ? "Verified" : "Rejected"} educator status for @${reqItem.username}`,
  });

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath(`/u/${reqItem.username}`);
  revalidatePath("/teacher/verification");
}

/**
 * Admin User Account Management (Role / Active Toggle)
 */
export async function manageUserAdminAction(formData: FormData): Promise<void> {
  const session = await getCurrentSession();
  const unlocked = await isAdminVaultUnlocked();

  if (!session || session.role !== "admin" || !unlocked) {
    throw new Error("Unauthorized user management request");
  }

  const targetUsername = (formData.get("targetUsername") as string)?.toLowerCase();
  const operation = formData.get("operation") as "toggle_active" | "make_teacher" | "make_moderator" | "make_student";

  if (!targetUsername || targetUsername === "studentrepo_admin") {
    return; // Protect root admin
  }

  const state = await loadPlatformState();
  const user = state.users.find((u) => u.username_normalized === targetUsername);
  if (!user) return;

  if (operation === "toggle_active") {
    user.is_active = !user.is_active;
  } else if (operation === "make_teacher") {
    user.role = "teacher";
    user.verification_status = "verified";
  } else if (operation === "make_moderator") {
    user.role = "moderator";
  } else if (operation === "make_student") {
    user.role = "student";
  }

  await savePlatformState(state);

  await appendAuditLog({
    actor_username: session.username,
    actor_role: session.role,
    action: `USER_ADMIN_${operation.toUpperCase()}`,
    target: `@${user.username}`,
    status: "success",
    details: `Updated @${user.username} (role=${user.role}, active=${user.is_active})`,
  });

  revalidatePath("/admin");
  revalidatePath("/leaderboard");
  revalidatePath(`/u/${user.username}`);
}

/**
 * Update User Profile Picture (PFP), Display Name & Bio
 */
export async function updateUserProfileAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await getCurrentSession();
  if (!session) {
    return { success: false, error: "Please sign in to update your profile." };
  }

  const avatarDataUrl = (formData.get("avatarDataUrl") as string)?.trim() || "";
  const fullName = (formData.get("fullName") as string)?.trim();
  const bio = (formData.get("bio") as string)?.trim();

  if (avatarDataUrl && avatarDataUrl.length > 450_000) {
    return { success: false, error: "Profile picture is too large. Please choose a smaller image." };
  }

  try {
    const state = await loadPlatformState();
    const user = state.users.find(
      (u) => u.username_normalized === session.username.toLowerCase()
    );
    if (!user) {
      return { success: false, error: "Account not found." };
    }

    if (avatarDataUrl === "__CLEAR__") {
      user.avatar_url = null;
    } else if (avatarDataUrl) {
      user.avatar_url = avatarDataUrl;
    }

    if (fullName && fullName.length >= 2) {
      user.full_name = fullName;
    }
    if (typeof bio === "string") {
      user.bio = bio.slice(0, 240);
    }

    // Propagate updated avatar and name to all resources uploaded by this user
    for (const res of state.customResources) {
      if (
        res.uploader_id === user.id ||
        res.uploader?.username.toLowerCase() === user.username_normalized
      ) {
        if (res.uploader) {
          res.uploader.avatar_url = user.avatar_url || null;
          res.uploader.full_name = user.full_name;
        }
      }
    }

    await savePlatformState(state);

    revalidatePath("/dashboard");
    revalidatePath(`/u/${user.username}`);
    revalidatePath("/leaderboard");
    revalidatePath("/explore");
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update profile";
    return { success: false, error: message };
  }
}

/**
 * Save Quick Notes, Previous Year (PYQ) Analysis & Exam Predictions for a PDF Resource
 */
export async function saveResourceStudyNotesAction(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const session = await getCurrentSession();
  if (!session) {
    return { success: false, error: "Sign in to contribute study notes & predictions." };
  }

  const resourceId = (formData.get("resourceId") as string)?.trim();
  const quickNotes = (formData.get("quickNotes") as string)?.trim() || null;
  const pyqAnalysis = (formData.get("pyqAnalysis") as string)?.trim() || null;
  const examPredictions = (formData.get("examPredictions") as string)?.trim() || null;

  if (!resourceId) {
    return { success: false, error: "Missing resource ID." };
  }

  try {
    const state = await loadPlatformState();
    const res = state.customResources.find((r) => r.id === resourceId);
    if (!res) {
      return { success: false, error: "Resource not found." };
    }

    res.quick_notes = quickNotes;
    res.pyq_analysis = pyqAnalysis;
    res.exam_predictions = examPredictions;
    res.updated_at = new Date().toISOString();

    await savePlatformState(state);

    revalidatePath(`/resource/${res.slug}`);
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Could not save study notes";
    return { success: false, error: message };
  }
}

