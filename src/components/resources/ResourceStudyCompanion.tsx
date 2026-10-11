"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  TrendingUp,
  Target,
  BookOpen,
  Edit3,
  Check,
  Save,
  NotebookPen,
  BarChart3,
  Flame,
} from "lucide-react";
import { saveResourceStudyNotesAction } from "@/lib/auth/actions";

interface ResourceStudyCompanionProps {
  resourceId: string;
  slug: string;
  title: string;
  classId: string;
  subjectId: string;
  resourceTypeId: string;
  quickNotes?: string | null;
  pyqAnalysis?: string | null;
  examPredictions?: string | null;
  canEdit: boolean;
}

function getDefaultInsights(classId: string, subjectId: string, title: string) {
  const cleanClass = classId.replace("-", " ").toUpperCase();
  const cleanSubject = subjectId.replace(/^(sslc|plus-one|plus-two|class-8|class-9)-/, "").replace(/-/g, " ");

  const defaultQuickNotes = [
    `Core definitions, formulas, and SCERT textbook summary points for ${title}.`,
    `Focus on highlighted NCERT/SCERT boxes, standard derivations, and labelled diagrams.`,
    `Revise all terminal exercise questions and Let's Assess sections before attempting timed papers.`,
  ];

  const defaultPyqWeightage = [
    {
      label: "Repeated Core Concepts (2021–2025)",
      weight: "42%",
      detail: `Direct & modified questions from ${cleanSubject || "core chapters"} appear in every March & SAY exam.`,
    },
    {
      label: "Application & Numericals / Case-Based",
      weight: "33%",
      detail: "3-mark and 4-mark analytical questions testing step-by-step working.",
    },
    {
      label: "1-Mark & Short Answer Objective",
      weight: "25%",
      detail: "Definitions, unit conversions, and direct textbook concept checks.",
    },
  ];

  const defaultPredictions = [
    {
      tag: "High Probability (90%+)",
      text: `Expect at least one 4-mark or 5-mark structured question from ${title} following the 2024–2025 DHSE/SCERT blueprint.`,
    },
    {
      tag: "Sure-Shot Pattern",
      text: ` focus on comparison tables, step-by-step derivations, and official answer-key keywords for full marks in ${cleanClass}.`,
    },
    {
      tag: "Scoring Tip",
      text: "Write value points in bullet format and underline key technical terms as specified in the Kerala Board scheme.",
    },
  ];

  return { defaultQuickNotes, defaultPyqWeightage, defaultPredictions };
}

export function ResourceStudyCompanion({
  resourceId,
  slug,
  title,
  classId,
  subjectId,
  QuickNotesProp,
  pyqAnalysis,
  examPredictions,
  canEdit,
  quickNotes,
}: ResourceStudyCompanionProps & { QuickNotesProp?: string | null }) {
  const activeQuickNotes = quickNotes ?? QuickNotesProp ?? "";
  const [activeTab, setActiveTab] = useState<"notes" | "pyq" | "predictions" | "scratchpad">("notes");
  const [isEditing, setIsEditing] = useState(false);

  const [notesDraft, setNotesDraft] = useState(activeQuickNotes);
  const [pyqDraft, setPyqDraft] = useState(pyqAnalysis || "");
  const [predictionsDraft, setPredictionsDraft] = useState(examPredictions || "");
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Personal local study scratchpad per resource
  const [personalNote, setPersonalNote] = useState("");
  const [personalSaved, setPersonalSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`studentrepo_scratch_${resourceId}`);
      if (saved) setPersonalNote(saved);
    } catch {
      // ignore storage errors
    }
  }, [resourceId]);

  const handleSavePersonal = () => {
    try {
      localStorage.setItem(`studentrepo_scratch_${resourceId}`, personalNote);
      setPersonalSaved(true);
      setTimeout(() => setPersonalSaved(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleSaveCommunityNotes = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    const formData = new FormData();
    formData.set("resource_id", resourceId);
    formData.set("slug", slug);
    formData.set("quick_notes", notesDraft);
    formData.set("pyq_analysis", pyqDraft);
    formData.set("exam_predictions", predictionsDraft);

    const res = await saveResourceStudyNotesAction(formData);
    setSaving(false);
    if (res.error) {
      setFeedback(res.error);
    } else {
      setFeedback("Study insights updated!");
      setIsEditing(false);
    }
  };

  const { defaultQuickNotes, defaultPyqWeightage, defaultPredictions } = getDefaultInsights(
    classId,
    subjectId,
    title
  );

  return (
    <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-5 sm:p-6 dark:border-[#1E2922] dark:bg-[#0F1310]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#D8CEBE]/80 dark:border-[#1E2922]">
        <div className="flex items-center gap-2.5">
          <div className="clay-pill flex h-9 w-9 items-center justify-center rounded-xl bg-[#2FB617]/12 text-[#2FB617] ring-1 ring-[#2FB617]/25">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">
              Smart Study Companion & PYQ Intelligence
            </h2>
            <p className="text-2xs text-[#5C574F] dark:text-[#94A3B8]">
              Quick revision notes, past year trend analysis & exam predictions for this PDF
            </p>
          </div>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className="clay-pill inline-flex items-center gap-1.5 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/60 px-3 py-1.5 text-xs font-semibold text-[#090A0B] hover:border-[#2FB617] dark:border-[#1E2922] dark:bg-[#161F19] dark:text-[#F4EEE2] transition"
          >
            <Edit3 className="h-3.5 w-3.5 text-[#2FB617]" />
            {isEditing ? "Close Editor" : "Edit Study Insights"}
          </button>
        )}
      </div>

      {/* Inline Editor for Contributors / Signed-In Users */}
      {isEditing && (
        <form
          onSubmit={handleSaveCommunityNotes}
          className="mt-4 mb-5 space-y-3.5 rounded-xl border border-[#2FB617]/30 bg-[#E8DFCE]/40 p-4 dark:bg-[#121814]"
        >
          <p className="text-xs font-bold text-[#090A0B] dark:text-[#F4EEE2]">
            Update Quick Notes, PYQ Analysis & Predictions for this PDF
          </p>
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-[#5C574F] dark:text-[#94A3B8] mb-1">
              Quick Revision Notes (Key formulas, bullet points, summaries)
            </label>
            <textarea
              rows={3}
              value={notesDraft}
              onChange={(e) => setNotesDraft(e.target.value)}
              placeholder="Enter key formulas, bullet points, or chapter summary..."
              className="w-full rounded-xl border border-[#D8CEBE] bg-white px-3 py-2 text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-[#5C574F] dark:text-[#94A3B8] mb-1">
                Previous Year (PYQ) Analysis
              </label>
              <textarea
                rows={3}
                value={pyqDraft}
                onChange={(e) => setPyqDraft(e.target.value)}
                placeholder="e.g., 2022-2025 weightage: 8 marks every year from theorem 2 & numericals..."
                className="w-full rounded-xl border border-[#D8CEBE] bg-white px-3 py-2 text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
              />
            </div>
            <div>
              <label className="block text-2xs font-bold uppercase tracking-wider text-[#5C574F] dark:text-[#94A3B8] mb-1">
                Exam Predictions & Sure-Shot Topics
              </label>
              <textarea
                rows={3}
                value={predictionsDraft}
                onChange={(e) => setPredictionsDraft(e.target.value)}
                placeholder="e.g., Expected 5-mark essay question for March 2026..."
                className="w-full rounded-xl border border-[#D8CEBE] bg-white px-3 py-2 text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-[#5C574F] hover:text-[#090A0B] dark:text-[#94A3B8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="clay-btn inline-flex items-center gap-1.5 rounded-xl bg-[#2FB617] px-4 py-1.5 text-xs font-bold text-[#090A0B] hover:text-white disabled:opacity-50 transition"
            >
              <Save className="h-3.5 w-3.5" />
              {saving ? "Saving..." : "Save Insights"}
            </button>
          </div>
        </form>
      )}

      {feedback && (
        <div className="mt-3 rounded-xl bg-[#2FB617]/10 border border-[#2FB617]/30 px-3.5 py-2 text-xs font-semibold text-[#259212] dark:text-[#2FB617]">
          {feedback}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("notes")}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "notes"
              ? "clay-btn bg-[#2FB617] text-[#090A0B]"
              : "clay-pill border border-[#D8CEBE] bg-[#E8DFCE]/50 text-[#5C574F] hover:text-[#090A0B] dark:border-[#1E2922] dark:bg-[#161F19] dark:text-[#94A3B8]"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          Quick Notes
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pyq")}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "pyq"
              ? "clay-btn bg-[#2FB617] text-[#090A0B]"
              : "clay-pill border border-[#D8CEBE] bg-[#E8DFCE]/50 text-[#5C574F] hover:text-[#090A0B] dark:border-[#1E2922] dark:bg-[#161F19] dark:text-[#94A3B8]"
          }`}
        >
          <TrendingUp className="h-3.5 w-3.5" />
          Prev Year (PYQ) Analysis
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("predictions")}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "predictions"
              ? "clay-btn bg-[#2FB617] text-[#090A0B]"
              : "clay-pill border border-[#D8CEBE] bg-[#E8DFCE]/50 text-[#5C574F] hover:text-[#090A0B] dark:border-[#1E2922] dark:bg-[#161F19] dark:text-[#94A3B8]"
          }`}
        >
          <Target className="h-3.5 w-3.5" />
          Exam Predictions
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("scratchpad")}
          className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
            activeTab === "scratchpad"
              ? "clay-btn bg-[#2FB617] text-[#090A0B]"
              : "clay-pill border border-[#D8CEBE] bg-[#E8DFCE]/50 text-[#5C574F] hover:text-[#090A0B] dark:border-[#1E2922] dark:bg-[#161F19] dark:text-[#94A3B8]"
          }`}
        >
          <NotebookPen className="h-3.5 w-3.5" />
          My Study Pad
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-4">
        {activeTab === "notes" && (
          <div className="space-y-3 animate-fade-in">
            {notesDraft.trim() ? (
              <div className="rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/45 p-4 text-xs sm:text-sm text-[#090A0B] dark:border-[#1E2922] dark:bg-[#121713] dark:text-[#F4EEE2] whitespace-pre-line leading-relaxed">
                {notesDraft}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-2xs font-bold uppercase tracking-wider text-[#259212] dark:text-[#2FB617]">
                    Key Revision Checklist
                  </span>
                  <span className="text-2xs text-[#5C574F] dark:text-[#94A3B8]">
                    SCERT / DHSE Exam Focus
                  </span>
                </div>
                {defaultQuickNotes.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 rounded-xl border border-[#D8CEBE]/80 bg-[#E8DFCE]/40 p-3 text-xs text-[#090A0B] dark:border-[#1E2922] dark:bg-[#121713] dark:text-[#F4EEE2]"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#2FB617]/15 text-2xs font-bold text-[#259212] dark:text-[#2FB617]">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "pyq" && (
          <div className="space-y-3 animate-fade-in">
            {pyqDraft.trim() && (
              <div className="rounded-xl border border-[#2FB617]/30 bg-[#2FB617]/8 p-4 text-xs sm:text-sm text-[#090A0B] dark:bg-[#121B14] dark:text-[#F4EEE2] whitespace-pre-line leading-relaxed">
                <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-[#259212] dark:text-[#2FB617] mb-1.5">
                  <BarChart3 className="h-3.5 w-3.5" /> Contributor PYQ Breakdown
                </div>
                {pyqDraft}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {defaultPyqWeightage.map((w, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/40 p-3.5 dark:border-[#1E2922] dark:bg-[#121713]"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xs font-bold text-[#5C574F] dark:text-[#94A3B8]">
                      {w.label}
                    </span>
                    <span className="rounded-lg bg-[#2FB617]/15 px-2 py-0.5 text-xs font-extrabold text-[#259212] dark:text-[#2FB617]">
                      {w.weight}
                    </span>
                  </div>
                  <p className="text-2xs text-[#5C574F] dark:text-[#94A3B8] leading-relaxed">
                    {w.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "predictions" && (
          <div className="space-y-3 animate-fade-in">
            {predictionsDraft.trim() && (
              <div className="rounded-xl border border-[#2FB617]/30 bg-[#2FB617]/8 p-4 text-xs sm:text-sm text-[#090A0B] dark:bg-[#121B14] dark:text-[#F4EEE2] whitespace-pre-line leading-relaxed">
                <div className="flex items-center gap-1.5 text-2xs font-bold uppercase tracking-wider text-[#259212] dark:text-[#2FB617] mb-1.5">
                  <Flame className="h-3.5 w-3.5" /> Contributor Exam Forecast
                </div>
                {predictionsDraft}
              </div>
            )}

            <div className="space-y-2.5">
              {defaultPredictions.map((pred, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-[#D8CEBE] bg-[#E8DFCE]/40 p-3.5 dark:border-[#1E2922] dark:bg-[#121713]"
                >
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#2FB617]/15 px-2 py-0.5 text-2xs font-bold text-[#259212] dark:text-[#2FB617]">
                      <Flame className="h-3 w-3" /> {pred.tag}
                    </span>
                    <p className="text-xs text-[#090A0B] dark:text-[#F4EEE2] leading-relaxed">
                      {pred.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "scratchpad" && (
          <div className="space-y-2.5 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#090A0B] dark:text-[#F4EEE2]">
                Personal Study Scratchpad (Saved in your browser for this PDF)
              </span>
              <button
                type="button"
                onClick={handleSavePersonal}
                className="clay-btn inline-flex items-center gap-1 rounded-lg bg-[#2FB617] px-3 py-1 text-2xs font-bold text-[#090A0B] hover:text-white transition"
              >
                <Check className="h-3 w-3" />
                {personalSaved ? "Saved!" : "Save Note"}
              </button>
            </div>
            <textarea
              rows={4}
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Jot down your own page bookmarks, formulas, or doubts while reading this PDF..."
              className="clay-input w-full rounded-xl border border-[#D8CEBE] bg-white p-3 text-xs text-[#090A0B] focus:border-[#2FB617] focus:outline-none dark:border-[#1E2922] dark:bg-[#0A0D0B] dark:text-[#F4EEE2]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
