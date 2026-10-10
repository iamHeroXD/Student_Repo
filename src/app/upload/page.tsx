"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";
import { Upload, CheckCircle, FileText, AlertCircle, ArrowRight } from "lucide-react";

export default function UploadPage() {
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedClass, setSelectedClass] = useState("plus-two");
  const [selectedType, setSelectedType] = useState("notes");
  const [hasRights, setHasRights] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf") {
        alert("Please upload a PDF document.");
        return;
      }
      setFile(selected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasRights) {
      alert("Please confirm the rights declaration statement.");
      return;
    }
    setIsSubmitting(true);
    // Simulate secure submission to Supabase storage & resources table
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mx-auto mb-4">
          <CheckCircle className="h-6 w-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
          Resource Submitted for Moderation
        </h2>
        <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
          Thank you for contributing to <strong>{siteConfig.name}</strong>! Your document &quot;{title}&quot; has been assigned state <code>pending_review</code>. Our moderation team will verify academic quality before publication.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => {
              setSubmitted(false);
              setStep(1);
              setFile(null);
              setTitle("");
            }}
            className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white dark:bg-amber-600"
          >
            Upload Another Document
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-stone-900 dark:text-stone-100">
          Contribute Academic Material
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Share chapter notes, previous question papers, or practical records with Kerala students.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-stone-200 bg-white p-6 shadow-xs dark:border-stone-800 dark:bg-stone-900">
        {/* Step 1: File Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">
            1. Select PDF Document
          </label>
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-300 p-6 hover:border-amber-500 transition dark:border-stone-700">
            <Upload className="h-8 w-8 text-stone-400 mb-2" />
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              required
              aria-label="Upload PDF Document"
              className="text-xs text-stone-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            />
            {file && (
              <span className="text-xs font-medium text-emerald-600 mt-2">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </span>
            )}
          </div>
        </div>

        {/* Step 2: Metadata */}
        <div className="space-y-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
            2. Resource Details
          </label>

          <div>
            <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Plus Two Botany Reproduction in Flowering Plants Notes"
              required
              className="w-full mt-1 rounded-lg border border-stone-300 p-2.5 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Class</label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full mt-1 rounded-lg border border-stone-300 p-2 text-xs dark:border-stone-700 dark:bg-stone-800"
              >
                {siteConfig.supportedClasses.map((c) => (
                  <option key={c.id} value={c.slug}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full mt-1 rounded-lg border border-stone-300 p-2 text-xs dark:border-stone-700 dark:bg-stone-800"
              >
                {siteConfig.resourceTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a short summary of the chapters, derivations, or questions covered in this document..."
              rows={3}
              required
              className="w-full mt-1 rounded-lg border border-stone-300 p-2.5 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-600 dark:text-stone-400">Original Author / Teacher Name</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Dr. K. S. Radhakrishnan or Self"
              className="w-full mt-1 rounded-lg border border-stone-300 p-2.5 text-xs text-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-100"
            />
          </div>
        </div>

        {/* Step 3: Rights Declaration */}
        <div className="rounded-lg bg-stone-50 p-4 border border-stone-200 dark:bg-stone-800/50 dark:border-stone-800">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={hasRights}
              onChange={(e) => setHasRights(e.target.checked)}
              required
              className="mt-0.5 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              I certify that I am the creator of this document or have explicit permission to distribute it for non-commercial educational purposes under the {siteConfig.name} Community Guidelines.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !file}
          className="w-full rounded-xl bg-amber-600 py-3 text-xs font-semibold text-white shadow-xs hover:bg-amber-500 disabled:opacity-50 transition"
        >
          {isSubmitting ? "Uploading Document..." : "Submit for Moderation"}
        </button>
      </form>
    </div>
  );
}
