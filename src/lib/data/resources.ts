import { Resource, Subject } from "@/types";

export const mockSubjects: Subject[] = [
  { id: "plus-two-biology", class_id: "plus-two", stream_id: "science", name: "Biology (Botany & Zoology)", code: "BIO12", slug: "biology", description: "Higher Secondary Biology curriculum" },
  { id: "plus-two-physics", class_id: "plus-two", stream_id: "science", name: "Physics", code: "PHY12", slug: "physics", description: "Mechanics, Electrostatics & Optics" },
  { id: "plus-two-chemistry", class_id: "plus-two", stream_id: "science", name: "Chemistry", code: "CHE12", slug: "chemistry", description: "Organic, Physical & Inorganic Chemistry" },
  { id: "plus-two-mathematics", class_id: "plus-two", stream_id: "science", name: "Mathematics", code: "MAT12", slug: "mathematics", description: "Calculus, Vectors & Matrices" },
  { id: "plus-two-computer-science", class_id: "plus-two", stream_id: "science", name: "Computer Science", code: "CS12", slug: "computer-science", description: "C++, Data Structures, Web & DBMS" },
  { id: "plus-two-accountancy", class_id: "plus-two", stream_id: "commerce", name: "Accountancy", code: "ACC12", slug: "accountancy", description: "Partnership & Company Accounts" },
  { id: "plus-two-business-studies", class_id: "plus-two", stream_id: "commerce", name: "Business Studies", code: "BS12", slug: "business-studies", description: "Principles of Management & Finance" },
  { id: "plus-two-economics", class_id: "plus-two", stream_id: "humanities", name: "Economics", code: "ECO12", slug: "economics", description: "Microeconomics & Macroeconomics" },
  { id: "plus-two-english", class_id: "plus-two", stream_id: "general", name: "English", code: "ENG12", slug: "english", description: "Core English Literature & Grammar" },
  { id: "plus-one-physics", class_id: "plus-one", stream_id: "science", name: "Physics", code: "PHY11", slug: "physics", description: "Kinematics, Laws of Motion & Thermodynamics" },
  { id: "plus-one-chemistry", class_id: "plus-one", stream_id: "science", name: "Chemistry", code: "CHE11", slug: "chemistry", description: "Atomic Structure, Bonding & Equilibrium" },
  { id: "plus-one-biology", class_id: "plus-one", stream_id: "science", name: "Biology", code: "BIO11", slug: "biology", description: "Diversity in Living World & Cell Biology" },
  { id: "plus-one-mathematics", class_id: "plus-one", stream_id: "science", name: "Mathematics", code: "MAT11", slug: "mathematics", description: "Sets, Trigonometry & Conic Sections" },
  { id: "class-10-mathematics", class_id: "class-10", stream_id: "general", name: "Mathematics", code: "MAT10", slug: "mathematics", description: "SSLC Arithmetic Sequences, Circles & Geometry" },
  { id: "class-10-physics", class_id: "class-10", stream_id: "general", name: "Physics", code: "PHY10", slug: "physics", description: "SSLC Current Electricity, Magnetism & Optics" },
  { id: "class-10-chemistry", class_id: "class-10", stream_id: "general", name: "Chemistry", code: "CHE10", slug: "chemistry", description: "SSLC Periodic Table, Mole Concept & Organic Chemistry" },
  { id: "class-10-biology", class_id: "class-10", stream_id: "general", name: "Biology", code: "BIO10", slug: "biology", description: "SSLC Nervous System, Genetics & Immunity" },
  { id: "class-10-social-science", class_id: "class-10", stream_id: "general", name: "Social Science", code: "SS10", slug: "social-science", description: "SSLC History, Geography & Civics" },
  { id: "class-9-science", class_id: "class-9", stream_id: "general", name: "Science & Mathematics", code: "SCI09", slug: "science", description: "Class 9 SCERT State Syllabus" },
  { id: "class-8-science", class_id: "class-8", stream_id: "general", name: "General Curriculum", code: "GEN08", slug: "general", description: "Class 8 SCERT State Syllabus" },
];

// Clean production state: zero fake or fabricated resources. All resources come from real Supabase uploads.
export const mockResources: Resource[] = [];
