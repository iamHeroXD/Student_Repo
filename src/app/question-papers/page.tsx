import { getApprovedResources } from "@/lib/supabase/persistence";
import { ResourceCard } from "@/components/resources/ResourceCard";
import { FileText, Upload, TrendingUp, Target, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Previous Year Question Papers, PYQ Analysis & Exam Predictions",
  description: "Kerala SSLC, Plus One & Plus Two previous year question papers, PYQ trend analysis, and 2026 exam predictions.",
};

const PYQ_INTELLIGENCE = [
  {
    level: "SSLC (Class 10)",
    badge: "SCERT Blueprint",
    repeatRate: "45% Repeated Pattern",
    highWeightage: [
      "Maths: Arithmetic Sequences, Trigonometry & Tangents (18+ Marks)",
      "Physics: Effects of Electric Current & Electromagnetic Induction",
      "Chemistry: Periodic Table, Mole Concept & Organic Nomenclature",
    ],
    prediction:
      "2026 Focus: Expect 4-mark application problems combining two sub-concepts in Physics & Maths Part-C.",
  },
  {
    level: "Plus One (Class 11)",
    badge: "DHSE Core",
    repeatRate: "38% PYQ Direct",
    highWeightage: [
      "Physics: Laws of Motion, Work-Energy Theorem, Thermodynamics & Gravitation",
      "Chemistry: Chemical Bonding, Equilibrium & Hydrocarbons mechanisms",
      "Commerce: Journal/Ledger Trial Balance & Final Accounts with Adjustments",
    ],
    prediction:
      "2026 Focus: Numericals from Thermodynamics & rotational motion derivations carry guaranteed 5-mark weightage.",
  },
  {
    level: "Plus Two (Class 12)",
    badge: "Board Final",
    repeatRate: "48% High-Yield PYQs",
    highWeightage: [
      "Physics: Ray/Wave Optics, Moving Charges, Alternating Current & Semiconductors",
      "Chemistry: Electrochemistry (Nernst Eq), Coordination Compounds & Aldehydes/Ketones",
      "Maths: Integration, Matrices (Martin's Rule) & Shortest Distance in 3D",
    ],
    prediction:
      "2026 Focus: 80%+ of 3-mark and 5-mark questions mirror 2021–2025 March & SAY question papers.",
  },
];

export default async function QuestionPapersPage() {
  const allApproved = await getApprovedResources();
  const papers = allApproved.filter(
    (r) =>
      r.resource_type_id === "question-paper" ||
      r.resource_type_id === "model-paper" ||
      r.resource_type_id === "answer-key"
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 sm:px-6 lg:px-8 animate-fade-up space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="clay-pill inline-flex items-center gap-1.5 rounded-full border border-[#2FB617]/25 bg-white px-3 py-1 text-2xs font-bold uppercase tracking-wider text-[#259212] dark:bg-[#0F1310] dark:text-[#2FB617] mb-2.5">
            <FileText className="h-3.5 w-3.5" /> Exam Archive & PYQ Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#090A0B] dark:text-[#F4EEE2] tracking-tight">
            Question Papers, PYQ Analysis & Predictions
          </h1>
          <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-1">
            Official question papers paired with 5-year weightage breakdowns and expected exam focus areas.
          </p>
        </div>

        <Link
          href="/upload"
          className="clay-btn inline-flex items-center gap-1.5 rounded-xl bg-[#2FB617] px-4 py-2.5 text-xs font-bold text-[#090A0B] hover:text-white transition-all self-start sm:self-auto"
        >
          <Upload className="h-3.5 w-3.5" />
          Upload Paper + PYQ Notes
        </Link>
      </div>

      {/* PYQ Analysis & 2026 Predictions Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#2FB617]" />
            <h2 className="text-sm sm:text-base font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">
              Previous Year (2021–2025) Analysis & 2026 Predictions
            </h2>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1 text-2xs font-semibold text-[#259212] dark:text-[#2FB617]">
            <Sparkles className="h-3 w-3" /> Updated for Kerala SCERT / DHSE
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {PYQ_INTELLIGENCE.map((item) => (
            <div
              key={item.level}
              className="clay-card flex flex-col justify-between rounded-2xl border border-[#D8CEBE] bg-white p-5 dark:border-[#1E2922] dark:bg-[#0F1310]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="rounded-lg bg-[#E5DEC9] px-2.5 py-1 text-xs font-extrabold text-[#090A0B] dark:bg-[#1E2922] dark:text-[#F4EEE2]">
                    {item.level}
                  </span>
                  <span className="rounded-lg bg-[#2FB617]/12 px-2.5 py-0.5 text-2xs font-bold text-[#259212] ring-1 ring-[#2FB617]/25 dark:text-[#2FB617]">
                    {item.repeatRate}
                  </span>
                </div>

                <p className="text-2xs font-bold uppercase tracking-wider text-[#5C574F] dark:text-[#94A3B8] mb-2">
                  High-Weightage Repeated Chapters
                </p>
                <ul className="space-y-1.5 mb-4">
                  {item.highWeightage.map((topic, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1.5 text-xs text-[#090A0B] dark:text-[#F4EEE2] leading-snug"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#2FB617] shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#2FB617]/25 bg-[#2FB617]/8 p-3 dark:bg-[#131C15]">
                <div className="flex items-center gap-1 text-2xs font-extrabold uppercase tracking-wider text-[#259212] dark:text-[#2FB617] mb-1">
                  <Target className="h-3 w-3" /> Prediction Insight
                </div>
                <p className="text-2xs text-[#090A0B] dark:text-[#F4EEE2] leading-relaxed">
                  {item.prediction}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Uploaded Question Papers & Answer Keys Grid */}
      <section className="space-y-4">
        <h2 className="text-sm sm:text-base font-extrabold text-[#090A0B] dark:text-[#F4EEE2]">
          Uploaded Question Papers & Answer Keys ({papers.length})
        </h2>

        {papers.length === 0 ? (
          <div className="clay-card rounded-2xl border border-[#D8CEBE] bg-white p-9 text-center dark:border-[#1E2922] dark:bg-[#0F1310]">
            <div className="animate-float-slow clay-pill flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2FB617]/12 text-[#2FB617] mx-auto mb-2.5 ring-1 ring-[#2FB617]/20">
              <FileText className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-[#090A0B] dark:text-[#F4EEE2]">
              No Question Papers Uploaded Yet
            </h3>
            <p className="text-xs text-[#5C574F] dark:text-[#94A3B8] mt-0.5">
              Upload previous papers, model papers, or answer keys with PYQ analysis.
            </p>
            <Link
              href="/upload"
              className="clay-btn mt-3.5 inline-flex items-center gap-1.5 rounded-xl bg-[#2FB617] px-4 py-2 text-xs font-bold text-[#090A0B] hover:text-white transition-all active:scale-96"
            >
              <Upload className="h-3.5 w-3.5" />
              Upload Paper PDF
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {papers.map((p) => (
              <ResourceCard key={p.id} resource={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

