import { SignJWT, jwtVerify } from "jose";

const JWT_SECRET = process.env.AUTH_SECRET || "student-repo-secure-jwt-signing-secret-key-32chars";
const encodedKey = new TextEncoder().encode(JWT_SECRET);

export interface SessionPayload {
  userId: string;
  username: string;
  role: "student" | "teacher" | "admin" | "moderator";
  verificationStatus: "none" | "pending" | "verified" | "rejected" | "revoked";
  fullName: string;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}
