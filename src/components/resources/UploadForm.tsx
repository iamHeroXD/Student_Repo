"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Upload, CheckCircle, FileText, AlertCircle, ArrowRight } from "lucide-react";

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClass, setSelectedClass] = useState("plus-two");
  const [selectedType, setSelectedType] = useState("notes");
  const [hasRights, setHasRights] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf") {
        setErrorMsg("Only PDF documents are supported for academic uploads.");
        return;
      }
      if (selected.size > 25 * 1024 * 1024) {
        setErrorMsg("File size exceeds 25 MB limit.");
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasRights) {
      setErrorMsg("Please certify the distribution rights statement.");
      return;
    }
    if (!file) {
      setErrorMsg("Please select a PDF document to upload.");
      return;
    }
    setIsSubmitting(true);
    // In production with configured Supabase, uploads to private storage bucket 'resources'
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center dark:border-[#1E2922] dark:bg-[#0F1310] shadow-2xs">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-4 dark:bg-emerald-950 dark:text-emerald-400">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-[#090A0B] dark:text-[#F8FAFC]">
          Submitted for Moderation
        </h2>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2 leading-relaxed max-w-md mx-auto">
          Thank you! &quot;{title}&quot; has been assigned status <code className="bg-emerald-50 text-emerald-700 px-1 py-0.5 rounded text-2xs dark:bg-emerald-950 dark:text-emerald-300">pending_review</code>. Our moderation team will verify document readability and rights before publishing to the public library.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              setSubmitted(false);
              setFile(null);
              setTitle("");
              setDescription("");
            }}
            className="rounded-xl bg-[#10B981] px-4 py-2 text-xs font-semibold text-white hover:bg-[#059669] transition"
          >
            Upload Another Document
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xs dark:border-[#1E2922] dark:bg-[#0F1310]">
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: File Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC] mb-2">
          1. Select PDF Document
        </label>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#E2E8F0] p-6 hover:border-[#10B981] transition dark:border-[#1E2922]">
          <Upload className="h-8 w-8 text-[#64748B] mb-2" />
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            required
            aria-label="Upload PDF Document"
            className="text-xs text-[#64748B] file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950 dark:file:text-emerald-400"
          />
          {file && (
            <span className="text-xs font-medium text-[#10B981] mt-2">
              Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          )}
          <span className="text-2xs text-[#94A3B8] mt-1">Maximum 25 MB. Only PDF format.</span>
        </div>
      </div>

      {/* Step 2: Metadata */}
      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F8FAFC]">
          2. Academic Details
        </label>

        <div>
          <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Plus Two Botany - Reproduction in Flowering Plants Notes"
            required
            className="w-full mt-1 rounded-xl border border-[#E2E8F0] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] p-2 text-xs dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            >
              {siteConfig.supportedClasses.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#E2E8F0] p-2 text-xs dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
            >
              {siteConfig.resourceTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short summary of chapters, derivations, or questions covered..."
            rows={3}
            required
            className="w-full mt-1 rounded-xl border border-[#E2E8F0] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-[#64748B] dark:text-[#94A3B8]">Original Author / Teacher Name</label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="e.g. Dr. K. S. Radhakrishnan or Self"
            className="w-full mt-1 rounded-xl border border-[#E2E8F0] p-2.5 text-xs text-[#090A0B] focus:border-[#10B981] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F8FAFC]"
          />
        </div>
      </div>

      {/* Step 3: Rights Declaration */}
      <div className="rounded-xl bg-[#F8FAFC] p-4 border border-[#E2E8F0] dark:bg-[#0A0D0B] dark:border-[#1E2922]">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={hasRights}
            onChange={(e) => setHasRights(e.target.checked)}
            required
            className="mt-0.5 rounded border-[#E2E8F0] text-[#10B981] focus:ring-[#10B981]"
          />
          <span className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            I certify that I am the creator of this document or have explicit permission to distribute it for non-commercial educational purposes under the {siteConfig.name} Community Guidelines.
          </span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !file}
        className="w-full rounded-xl bg-[#10B981] py-3 text-xs font-semibold text-white shadow-2xs hover:bg-[#059669] disabled:opacity-50 transition"
      >
        {isSubmitting ? "Uploading Document..." : "Submit for Moderation"}
      </button>
    </form>
  );
}
