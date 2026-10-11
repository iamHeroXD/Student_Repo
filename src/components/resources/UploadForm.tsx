"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { mockSubjects } from "@/lib/data/resources";
import { uploadResourceAction } from "@/lib/auth/actions";
import { Upload, CheckCircle, AlertCircle, FileText, ArrowRight } from "lucide-react";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClass, setSelectedClass] = useState("plus-two");
  const [selectedStream, setSelectedStream] = useState("science");
  const [selectedSubject, setSelectedSubject] = useState("plus-two-biology");
  const [selectedType, setSelectedType] = useState("notes");
  const [language, setLanguage] = useState("English");
  const [pageCount, setPageCount] = useState("1");
  const [authorName, setAuthorName] = useState("");
  const [institution, setInstitution] = useState("");
  const [hasRights, setHasRights] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    slug?: string;
    status?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const filteredSubjects = mockSubjects.filter((s) => s.class_id === selectedClass);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf" && !selected.name.toLowerCase().endsWith(".pdf")) {
        setErrorMsg("Only PDF documents (.pdf) are supported for academic uploads.");
        return;
      }
      if (selected.size > 25 * 1024 * 1024) {
        setErrorMsg("File size exceeds 25 MB limit.");
        return;
      }
      setFile(selected);
      if (!title) {
        const cleanName = selected.name.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ");
        setTitle(cleanName);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!hasRights) {
      setErrorMsg("Please certify the distribution rights statement.");
      return;
    }
    if (!file) {
      setErrorMsg("Please select a PDF document to upload.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("classId", selectedClass);
      formData.append("streamId", selectedStream);
      formData.append("subjectId", selectedSubject);
      formData.append("resourceTypeId", selectedType);
      formData.append("language", language);
      formData.append("pageCount", pageCount);
      formData.append("authorName", authorName);
      formData.append("institution", institution);

      const res = await uploadResourceAction(formData);
      setIsSubmitting(false);

      if (!res.success) {
        setErrorMsg(res.error || "Upload failed. Please try again.");
        return;
      }

      setSubmittedResult({ slug: res.slug, status: res.status });
    } catch {
      setIsSubmitting(false);
      setErrorMsg("Network or upload size error. Ensure the PDF is under 25 MB.");
    }
  };

  if (submittedResult) {
    const isApproved = submittedResult.status === "approved";
    return (
      <div className="rounded-2xl border border-[#D8CEBE] bg-white p-8 text-center dark:border-[#1E2922] dark:bg-[#0F1310] shadow-2xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#10B981]/15 text-[#10B981] mx-auto mb-4">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-[#090A0B] dark:text-[#F8FAFC]">
          {isApproved ? "Published to Library!" : "Uploaded & Queued for Moderation"}
        </h2>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2 leading-relaxed max-w-md mx-auto">
          {isApproved
            ? `Your PDF "${title}" has been stored in Supabase and published directly to the public library.`
            : `Your PDF "${title}" has been stored in Supabase with status pending_review. Once approved in the Admin Console, it will appear in the public library.`}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {submittedResult.slug && (
            <Link
              href={`/resource/${submittedResult.slug}`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#10B981] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#059669] transition"
            >
              View Document Page <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <button
            onClick={() => {
              setSubmittedResult(null);
              setFile(null);
              setTitle("");
              setDescription("");
            }}
            className="rounded-xl border border-[#D8CEBE] bg-white px-4 py-2.5 text-xs font-semibold text-[#090A0B] hover:bg-[#E8DFCE] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC] transition"
          >
            Upload Another PDF
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-[#D8CEBE] bg-white p-6 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]"
    >
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: File Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC] mb-2">
          1. Select PDF Document
        </label>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D8CEBE] p-6 hover:border-[#10B981] transition dark:border-[#1E2922]">
          <Upload className="h-8 w-8 text-[#10B981] mb-2" />
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            required
            aria-label="Upload PDF Document"
            className="text-xs text-[#64748B] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#10B981]/15 file:text-[#059669] dark:file:text-[#10B981] hover:file:bg-[#10B981]/25 cursor-pointer"
          />
          {file && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#10B981] mt-3">
              <FileText className="h-3.5 w-3.5" />
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          )}
          <span className="text-2xs text-[#94A3B8] mt-1">
            Uploaded directly to private Supabase Storage (Max 25 MB, PDF format).
          </span>
        </div>
      </div>

      {/* Step 2: Metadata */}
      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
          2. Academic Details
        </label>

        <div>
          <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
            Document Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Plus Two Physics - Electrostatics Complete Notes"
            required
            className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                const nextClass = e.target.value;
                setSelectedClass(nextClass);
                const firstSub = mockSubjects.find((s) => s.class_id === nextClass);
                if (firstSub) setSelectedSubject(firstSub.id);
              }}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            >
              {siteConfig.supportedClasses.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Stream</label>
            <select
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            >
              {siteConfig.streams.map((s) => (
                <option key={s.id} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
              Material Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            >
              {siteConfig.resourceTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            >
              {filteredSubjects.length > 0 ? (
                filteredSubjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))
              ) : (
                <option value={`${selectedClass}-general`}>General Curriculum</option>
              )}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
              Medium / Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            >
              <option value="English">English</option>
              <option value="Malayalam">Malayalam</option>
              <option value="English & Malayalam">English & Malayalam</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
              Page Count
            </label>
            <input
              type="number"
              min={1}
              max={500}
              value={pageCount}
              onChange={(e) => setPageCount(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
            Description & Topics Covered *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the chapters, derivations, or examination year covered in this PDF..."
            rows={3}
            required
            className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
              Author / Educator Name
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Defaults to your profile name"
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">
              School / Institution (Optional)
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. Govt Model HSS"
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            />
          </div>
        </div>
      </div>

      {/* Step 3: Rights Declaration */}
      <div className="rounded-xl bg-[#E8DFCE] p-4 border border-[#D8CEBE] dark:bg-[#0A0D0B] dark:border-[#1E2922]">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={hasRights}
            onChange={(e) => setHasRights(e.target.checked)}
            required
            className="mt-0.5 rounded border-[#D8CEBE] text-[#10B981] focus:ring-[#10B981]"
          />
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            I certify that I am the creator of this document or have permission to share it for open educational use under the {siteConfig.name} Community Guidelines.
          </span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !file}
        className="w-full rounded-xl bg-[#10B981] py-3 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] disabled:opacity-50 transition"
      >
        {isSubmitting ? "Uploading PDF to Supabase Storage..." : "Upload PDF Document"}
      </button>
    </form>
  );
}
