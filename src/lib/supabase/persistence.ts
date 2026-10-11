import bcrypt from "bcryptjs";
import { getServiceRoleClient } from "./client";
import { Resource } from "@/types";

const SYSTEM_BUCKET = "_system_db";
const STATE_FILE = "platform_state_v1.json";

export interface StoredUser {
  id: string;
  username: string;
  username_normalized: string;
  password_hash: string;
  role: "student" | "teacher" | "admin" | "moderator";
  is_active: boolean;
  full_name: string;
  verification_status: "none" | "pending" | "verified" | "rejected" | "revoked";
  target_class?: string | null;
  target_stream?: string | null;
  education_board?: string;
  institution_name?: string | null;
  reputation_score: number;
  created_at: string;
  last_login_at?: string | null;
  failed_attempts?: number;
  locked_until?: string | null;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor_username: string;
  actor_role: string;
  action: string;
  target: string;
  status: "success" | "blocked" | "warning";
  details?: string;
}

export interface VerificationRequestItem {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  school_name: string;
  subject_specialization: string;
  experience_years: number;
  status: "pending" | "verified" | "rejected";
  created_at: string;
}

export interface PlatformState {
  users: StoredUser[];
  customResources: Resource[];
  resourceStatusOverrides: Record<string, Resource["status"]>;
  verificationRequests: VerificationRequestItem[];
  auditLogs: AuditLogEntry[];
}

// Default pre-hashed bcrypt password for initial admin ("Admin@StudentRepo2026!")
const DEFAULT_ADMIN_HASH = bcrypt.hashSync("Admin@StudentRepo2026!", 10);

function getInitialState(): PlatformState {
  return {
    users: [
      {
        id: "00000000-0000-4000-8000-000000000001",
        username: "studentrepo_admin",
        username_normalized: "studentrepo_admin",
        password_hash: DEFAULT_ADMIN_HASH,
        role: "admin",
        is_active: true,
        full_name: "Platform Administrator",
        verification_status: "verified",
        education_board: "kerala-state",
        institution_name: "Student_Repo Directorate",
        reputation_score: 0,
        created_at: new Date().toISOString(),
        failed_attempts: 0,
      },
    ],
    customResources: [],
    resourceStatusOverrides: {},
    verificationRequests: [],
    auditLogs: [
      {
        id: "init-1",
        timestamp: new Date().toISOString(),
        actor_username: "system",
        actor_role: "system",
        action: "SECURITY_GUARD_INITIALIZED",
        target: "/admin",
        status: "success",
        details: "Multi-layer server-side admin verification & Supabase persistence active.",
      },
    ],
  };
}

let memoryFallbackState: PlatformState | null = null;

async function ensureSystemBucket() {
  const supabase = getServiceRoleClient();
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets && !buckets.find((b) => b.name === SYSTEM_BUCKET)) {
    await supabase.storage.createBucket(SYSTEM_BUCKET, {
      public: false,
      fileSizeLimit: 10485760,
    });
  }
}

export async function loadPlatformState(): Promise<PlatformState> {
  try {
    await ensureSystemBucket();
    const supabase = getServiceRoleClient();
    const { data, error } = await supabase.storage.from(SYSTEM_BUCKET).download(STATE_FILE);
    if (error || !data) {
      const initial = memoryFallbackState || getInitialState();
      await savePlatformState(initial);
      return initial;
    }
    const text = await data.text();
    const parsed = JSON.parse(text) as PlatformState;
    if (!parsed.users) parsed.users = [];
    if (!parsed.customResources) parsed.customResources = [];
    if (!parsed.resourceStatusOverrides) parsed.resourceStatusOverrides = {};
    if (!parsed.verificationRequests) parsed.verificationRequests = [];
    if (!parsed.auditLogs) parsed.auditLogs = [];

    if (!parsed.users.find((u) => u.username_normalized === "studentrepo_admin")) {
      parsed.users.unshift(getInitialState().users[0]);
    }
    memoryFallbackState = parsed;
    return parsed;
  } catch {
    if (!memoryFallbackState) {
      memoryFallbackState = getInitialState();
    }
    return memoryFallbackState;
  }
}

export async function savePlatformState(state: PlatformState): Promise<void> {
  memoryFallbackState = state;
  try {
    await ensureSystemBucket();
    const supabase = getServiceRoleClient();
    const payload = JSON.stringify(state, null, 2);
    await supabase.storage.from(SYSTEM_BUCKET).upload(STATE_FILE, Buffer.from(payload, "utf-8"), {
      contentType: "application/json",
      upsert: true,
    });
  } catch {
    // Keep memoryFallbackState if storage write fails
  }
}

export async function appendAuditLog(entry: Omit<AuditLogEntry, "id" | "timestamp">): Promise<void> {
  const state = await loadPlatformState();
  state.auditLogs.unshift({
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: new Date().toISOString(),
  });
  state.auditLogs = state.auditLogs.slice(0, 100);
  await savePlatformState(state);
}

export async function getAllMergedResources(): Promise<Resource[]> {
  const state = await loadPlatformState();
  return state.customResources.map((r) => ({
    ...r,
    status: state.resourceStatusOverrides[r.id] || r.status,
  }));
}

export async function getApprovedResources(): Promise<Resource[]> {
  const all = await getAllMergedResources();
  return all.filter((r) => r.status === "approved");
}

export async function getResourceBySlug(slug: string): Promise<Resource | null> {
  const all = await getAllMergedResources();
  return all.find((r) => r.slug === slug) || null;
}

export async function getResourceById(id: string): Promise<Resource | null> {
  const all = await getAllMergedResources();
  return all.find((r) => r.id === id) || null;
}
