export type UserRole = "student" | "teacher" | "admin" | "moderator";
export type VerificationStatus = "none" | "pending" | "verified" | "rejected" | "revoked";
export type ResourceStatus = "draft" | "uploading" | "pending_review" | "approved" | "rejected" | "changes_requested" | "archived" | "removed";

export interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url?: string | null;
  bio?: string | null;
  role: UserRole;
  verification_status: VerificationStatus;
  target_class?: string | null;
  target_stream?: string | null;
  reputation_score: number;
  created_at: string;
  updated_at: string;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description: string;
  board_id: string;
  class_id: string;
  stream_id?: string | null;
  subject_id: string;
  chapter_id?: string | null;
  resource_type_id: string;
  language: string;
  
  exam_year?: number | null;
  exam_type?: string | null;
  syllabus_year?: number | null;
  has_answer_key: boolean;
  download_allowed: boolean;
  
  storage_path: string;
  file_size_bytes: number;
  page_count: number;
  file_type: string;
  
  author_name?: string | null;
  school_or_institution?: string | null;
  rights_declaration: string;
  
  quick_notes?: string | null;
  pyq_analysis?: string | null;
  exam_predictions?: string | null;
  
  uploader_id: string;
  uploader?: Profile;
  status: ResourceStatus;
  moderation_notes?: string | null;
  
  views_count: number;
  preview_opens: number;
  downloads_count: number;
  saves_count: number;
  rating_sum: number;
  ratings_count: number;
  helpful_count: number;
  
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: string;
  class_id: string;
  stream_id?: string | null;
  name: string;
  code: string;
  slug: string;
  icon?: string | null;
  description?: string | null;
}

export interface Chapter {
  id: string;
  subject_id: string;
  chapter_number: number;
  title: string;
  slug: string;
  description?: string | null;
}

export interface StudyTask {
  id: string;
  user_id: string;
  title: string;
  subject_id?: string | null;
  chapter_id?: string | null;
  resource_id?: string | null;
  due_date?: string | null;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  created_at: string;
}

export interface ExamDate {
  id: string;
  user_id: string;
  exam_name: string;
  subject_id?: string | null;
  exam_date: string;
  created_at: string;
}
