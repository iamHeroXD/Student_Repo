"use server";

import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getServiceRoleClient } from "@/lib/supabase/client";
import { createSessionToken } from "./jwt";
import { SESSION_COOKIE_NAME, validateUsername } from "./session";

export interface AuthResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
}

export async function loginAction(formData: FormData): Promise<AuthResult> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { success: false, error: "Please provide both username and password." };
  }

  const normalized = username.trim().toLowerCase();

  try {
    const supabase = getServiceRoleClient();
    
    // Check credentials table
    const { data: creds, error } = await supabase
      .from("auth_credentials")
      .select("id, username, password_hash, role, is_active")
      .eq("username_normalized", normalized)
      .single();

    if (error || !creds || !creds.is_active) {
      return { success: false, error: "Invalid username or password." };
    }

    const matches = await bcrypt.compare(password, creds.password_hash);
    if (!matches) {
      return { success: false, error: "Invalid username or password." };
    }

    // Fetch user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, full_name, verification_status")
      .eq("id", creds.id)
      .single();

    // Create secure JWT token
    const token = await createSessionToken({
      userId: creds.id,
      username: creds.username,
      role: creds.role,
      verificationStatus: profile?.verification_status || "none",
      fullName: profile?.full_name || creds.username,
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Update last login timestamp
    await supabase
      .from("auth_credentials")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", creds.id);

    return { success: true, redirectTo: "/dashboard" };
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
  const role = (formData.get("role") as string) || "student";
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

  const normalized = username.toLowerCase();

  try {
    const supabase = getServiceRoleClient();

    // Check if username is already taken
    const { data: existing } = await supabase
      .from("auth_credentials")
      .select("id")
      .eq("username_normalized", normalized)
      .maybeSingle();

    if (existing) {
      return { success: false, error: "This username is already taken. Please choose another." };
    }

    // Hash password with bcrypt (salt rounds = 10)
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert into auth_credentials
    const { data: newCred, error: credError } = await supabase
      .from("auth_credentials")
      .insert({
        username,
        username_normalized: normalized,
        password_hash: passwordHash,
        role: role === "teacher" ? "teacher" : "student",
      })
      .select("id, username, role")
      .single();

    if (credError || !newCred) {
      return { success: false, error: credError?.message || "Failed to create user account." };
    }

    // Insert public profile
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: newCred.id,
        username: newCred.username,
        full_name: fullName,
        role: newCred.role,
        verification_status: "none",
        target_class: targetClass || null,
        target_stream: targetStream || null,
        education_board: educationBoard,
        institution_name: institutionName || null,
      });

    if (profileError) {
      return { success: false, error: profileError.message };
    }

    // Issue JWT session cookie
    const token = await createSessionToken({
      userId: newCred.id,
      username: newCred.username,
      role: newCred.role,
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

    return { 
      success: true, 
      redirectTo: role === "teacher" ? "/teacher/verification" : "/dashboard" 
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration error";
    return { success: false, error: message };
  }
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
