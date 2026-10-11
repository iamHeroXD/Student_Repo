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
  const [quickNotes, setQuickNotes] = useState("");
  const [pyqAnalysis, setPyqAnalysis] = useState("");
  const [examPredictions, setExamPredictions] = useState("");
  const [hasRights, setHasRights] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedResult, setSubmittedResult] = useState<{
    slug?: string;
    status?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const showStream = selectedClass === "plus-one" || selectedClass === "plus-two";
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
      if (showStream) {
        formData.append("streamId", selectedStream);
      }
      formData.append("subjectId", selectedSubject);
      formData.append("resourceTypeId", selectedType);
      formData.append("language", language);
      formData.append("pageCount", pageCount);
      formData.append("authorName", authorName);
      formData.append("institution", institution);
      if (quickNotes.trim()) formData.append("quickNotes", quickNotes.trim());
      if (pyqAnalysis.trim()) formData.append("pyqAnalysis", pyqAnalysis.trim());
      if (examPredictions.trim()) formData.append("examPredictions", examPredictions.trim());

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
      <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-8 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
        <div className="clay-pill flex h-12 w-12 items-center justify-center rounded-full bg-[#2FB617]/15 text-[#2FB617] mx-auto mb-4">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-[#090A0B] dark:text-[#F4EEE2]">
          {isApproved ? "Published to Library!" : "Uploaded & Queued for Review"}
        </h2>
        <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-1.5 max-w-md mx-auto">
          {isApproved
            ? `"${title}" is now live in the public library.`
            : `"${title}" is saved and queued for admin approval.`}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {submittedResult.slug && (
            <Link
              href={`/resource/${submittedResult.slug}`}
              className="clay-btn inline-flex items-center gap-1.5 rounded-xl bg-[#2FB617] px-4 py-2.5 text-xs font-bold text-[#090A0B] hover:text-white transition"
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
              setQuickNotes("");
              setPyqAnalysis("");
              setExamPredictions("");
            }}
            className="clay-pill rounded-xl border border-[#D8CEBE] bg-white px-4 py-2.5 text-xs font-semibold text-[#090A0B] hover:bg-[#E8DFCE] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2] transition"
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
      className="clay-card space-y-5 rounded-2xl border border-[#D8CEBE] bg-white p-5 sm:p-6 dark:border-[#1E2922] dark:bg-[#0F1310]"
    >
      {errorMsg && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/25 p-3 text-xs text-rose-600 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Step 1: File Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F4EEE2] mb-2">
          1. Select PDF File
        </label>
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#D8CEBE] bg-[#E8DFCE]/40 p-5 hover:border-[#2FB617] transition dark:border-[#1E2922] dark:bg-[#0A0D0B]/50">
          <Upload className="h-7 w-7 text-[#2FB617] mb-2" />
          <input
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            required
            aria-label="Upload PDF Document"
            className="text-xs text-[#5C574F] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2FB617]/15 file:text-[#259212] dark:file:text-[#2FB617] hover:file:bg-[#2FB617]/25 cursor-pointer"
          />
          {file && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2FB617] mt-2.5">
              <FileText className="h-3.5 w-3.5" />
              {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          )}
        </div>
      </div>

      {/* Step 2: Metadata */}
      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F4EEE2]">
          2. Academic Details
        </label>

        <div>
          <label className="text-xs font-medium text-[#5C574F] dark:text-[#94A3B8]">
            Document Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Plus Two Physics - Electrostatics Quick Notes"
            required
            className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
          />
        </div>

        <div className={`grid grid-cols-1 ${showStream ? "sm:grid-cols-3" : "sm:grid-cols-2"} gap-3.5`}>
          <div>
            <label className="text-xs font-medium text-[#5C574F] dark:text-[#94A3B8]">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => {
                const nextClass = e.target.value;
                setSelectedClass(nextClass);
                const firstSub = mockSubjects.find((s) => s.class_id === nextClass);
                if (firstSub) setSelectedSubject(firstSub.id);
              }}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
            >
              {siteConfig.supportedClasses.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {showStream && (
            <div className="animate-fade-in">
              <label className="text-xs font-medium text-[#5C574F] dark:text-[#94A3B8]">
                Stream (Plus One / Two)
              </label>
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
                className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
              >
                {siteConfig.streams
                  .filter((s) => s.slug !== "general")
                  .map((s) => (
                    <option key={s.id} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-[#5C574F] dark:text-[#94A3B8]">
              Material Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
            >
              {siteConfig.resourceTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div>
            <label className="text-xs font-medium text-[#5C574F] dark:text-[#94A3B8]">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
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
            <label className="text-xs font-medium text-[#5C574F] dark:text-[#94A3B8]">
              Medium / Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
            >
              <option value="English">English</option>
              <option value="Malayalam">Malayalam</option>
              <option value="English & Malayalam">English & Malayalam</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-[#5C574F] dark:text-[#94A3B8]">
              Page Count
            </label>
            <input
              type="number"
              min={1}
              max={500}
              value={pageCount}
              onChange={(e) => setPageCount(e.target.value)}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-[#5C574F] dark:text-[#94A3B8]">
            Short Summary *
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Chapters, derivations, or exam year covered..."
            rows={2}
            required
            className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:bg-white focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
          />
        </div>

        {/* Step 3: Optional Study Companion (Quick Notes, PYQ Analysis & Exam Predictions) */}
        <div className="rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/45 p-4 space-y-3 dark:border-[#1E2922] dark:bg-[#0A0D0B]/60">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#090A0B] dark:text-[#F4EEE2]">
              3. Quick Notes, PYQ Analysis & Predictions (Optional)
            </span>
            <span className="text-2xs text-[#259212] dark:text-[#2FB617] font-semibold">
              Shown alongside PDF
            </span>
          </div>

          <div>
            <label className="text-2xs font-semibold text-[#5C574F] dark:text-[#94A3B8]">
              Quick Revision Notes / Key Formulas
            </label>
            <textarea
              value={quickNotes}
              onChange={(e) => setQuickNotes(e.target.value)}
              placeholder="Bullet points, key definitions, or formulas for fast revision..."
              rows={2}
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-white p-2.5 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-2xs font-semibold text-[#5C574F] dark:text-[#94A3B8]">
                Previous Year (PYQ) Trend Analysis
              </label>
              <textarea
                value={pyqAnalysis}
                onChange={(e) => setPyqAnalysis(e.target.value)}
                placeholder="e.g. Asked 4 times in 2021–2025 March exams (5 marks)..."
                rows={2}
                className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-white p-2.5 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2]"
              />
            </div>

            <div>
              <label className="text-2xs font-semibold text-[#5C574F] dark:text-[#94A3B8]">
                Exam Predictions & Sure-Shot Topics
              </label>
              <textarea
                value={examPredictions}
                onChange={(e) => setExamPredictions(e.target.value)}
                placeholder="e.g. High probability 4-mark derivation for upcoming board exam..."
                rows={2}
                className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-white p-2.5 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0F1310] dark:text-[#F4EEE2]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className="text-xs font-medium text-[#5C574F] dark:text-[#94A3B8]">
              Author Name (Optional)
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Defaults to your profile name"
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#5C574F] dark:text-[#94A3B8]">
              School / Institution (Optional)
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="e.g. Govt Model HSS"
              className="w-full mt-1 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 p-2.5 text-base sm:text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
            />
          </div>
        </div>
      </div>

      {/* Rights Declaration */}
      <div className="rounded-xl bg-[#E8DFCE] p-3.5 border border-[#D8CEBE] dark:bg-[#0A0D0B] dark:border-[#1E2922]">
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={hasRights}
            onChange={(e) => setHasRights(e.target.checked)}
            required
            className="mt-0.5 rounded border-[#D8CEBE] text-[#2FB617] focus:ring-[#2FB617]"
          />
          <span className="text-xs text-[#5C574F] dark:text-[#94A3B8]">
            I confirm this PDF is for open educational sharing under {siteConfig.name} guidelines.
          </span>
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting || !file}
        className="clay-btn w-full rounded-xl bg-[#2FB617] py-3 text-xs font-bold text-[#090A0B] hover:text-white disabled:opacity-50 transition"
      >
        {isSubmitting ? "Uploading PDF..." : "Upload PDF"}
      </button>
    </form>
  );
}
