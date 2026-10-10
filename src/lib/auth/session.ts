import { cookies } from "next/headers";
import { verifySessionToken, SessionPayload } from "./jwt";

export const SESSION_COOKIE_NAME = "sr_session";

export async function getCurrentSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export function validateUsername(username: string): { valid: boolean; error?: string } {
  const trimmed = username.trim();
  if (trimmed.length < 3 || trimmed.length > 24) {
    return { valid: false, error: "Username must be between 3 and 24 characters." };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
    return { valid: false, error: "Username can only contain letters, numbers, and underscores." };
  }
  const reserved = ["admin", "administrator", "support", "system", "moderator", "student_repo", "root"];
  if (reserved.includes(trimmed.toLowerCase())) {
    return { valid: false, error: "This username is reserved." };
  }
  return { valid: true };
}
