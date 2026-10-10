import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Community & Academic Upload Guidelines",
  description: "Standards and rules for sharing learning materials on Student_Repo.",
};

export default function GuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-extrabold text-stone-900 dark:text-stone-100">
        Community & Upload Guidelines
      </h1>
      <p className="text-xs text-stone-500 mt-2">
        Last updated: October 2026 • {siteConfig.name} Standards
      </p>

      <div className="mt-8 space-y-6 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            1. Respect Copyright & Original Authorship
          </h2>
          <p>
            Do not upload copyrighted textbooks, paid question banks, or private tuition institute publications without documented distribution authorization. We welcome self-prepared notes, public board examination papers, and teacher-compiled summaries.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            2. Legibility and Document Quality
          </h2>
          <p>
            Scanned handwritten notes must be clearly readable, properly oriented, and high contrast. Pages must be in correct numerical sequence. Avoid blurry photos taken under poor lighting.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            3. Accurate Metadata and Labeling
          </h2>
          <p>
            Correctly assign the class, stream, subject, and chapter. Misleading titles or labeling an unverified answer key as official will result in rejection or account suspension.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
            4. Verified Teacher Accounts
          </h2>
          <p>
            Educators can request teacher badges by submitting their school affiliation. Verified badges are subject to continuous quality and community review.
          </p>
        </section>
      </div>
    </div>
  );
}
