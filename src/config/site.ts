export const siteConfig = {
  name: "Student_Repo",
  shortName: "Student_Repo",
  description: "A calm, fast, and structured academic resource library for Kerala State Board students and teachers. Discover revision notes, previous-year question papers, model papers, and practical records without clutter.",
  tagline: "Everything you need to study smarter, in one clean repository.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  author: "Student_Repo Community",
  links: {
    github: "https://github.com",
    guidelines: "/guidelines",
    terms: "/terms",
    privacy: "/privacy",
    copyright: "/copyright",
  },
  theme: {
    accentColor: "#f59e0b", // Amber/Gold warm accent
    primaryBg: "#faf9f6",   // Warm off-white
  },
  boardDefault: "Kerala State Board (SCERT / DHSE)",
  supportedClasses: [
    { id: "class-8", name: "Class 8", slug: "class-8" },
    { id: "class-9", name: "Class 9", slug: "class-9" },
    { id: "class-10", name: "Class 10 / SSLC", slug: "class-10" },
    { id: "plus-one", name: "Plus One (Class 11)", slug: "plus-one" },
    { id: "plus-two", name: "Plus Two (Class 12)", slug: "plus-two" },
  ],
  streams: [
    { id: "science", name: "Science", slug: "science" },
    { id: "commerce", name: "Commerce", slug: "commerce" },
    { id: "humanities", name: "Humanities", slug: "humanities" },
    { id: "general", name: "General", slug: "general" },
  ],
  resourceTypes: [
    { id: "notes", name: "Chapter Notes & Revision", slug: "notes" },
    { id: "question-paper", name: "Previous Year Question Papers", slug: "question-papers" },
    { id: "answer-key", name: "Answer Keys & Scoring Schemes", slug: "answer-keys" },
    { id: "model-paper", name: "Model Question Papers", slug: "model-papers" },
    { id: "worksheet", name: "Worksheets & Question Banks", slug: "worksheets" },
    { id: "practical-manual", name: "Practical Lab Manuals", slug: "practical-manuals" },
  ]
};
