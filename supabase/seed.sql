-- ==============================================================================
-- PADIPPURA SEED DATA (Kerala State Board Taxonomy & Sample Approved Resources)
-- ==============================================================================

-- 1. Boards
INSERT INTO public.boards (id, name, code, description) VALUES
('kerala-state', 'Kerala State Board (SCERT / DHSE)', 'KBPE', 'Kerala State Education Board curriculum for High School and Higher Secondary')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 2. Classes
INSERT INTO public.classes (id, board_id, name, numeric_order, slug) VALUES
('class-8', 'kerala-state', 'Class 8', 8, 'class-8'),
('class-9', 'kerala-state', 'Class 9', 9, 'class-9'),
('class-10', 'kerala-state', 'Class 10 / SSLC', 10, 'class-10'),
('plus-one', 'kerala-state', 'Plus One (Class 11)', 11, 'plus-one'),
('plus-two', 'kerala-state', 'Plus Two (Class 12)', 12, 'plus-two')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 3. Streams
INSERT INTO public.streams (id, name, slug) VALUES
('science', 'Science', 'science'),
('commerce', 'Commerce', 'commerce'),
('humanities', 'Humanities', 'humanities'),
('general', 'General', 'general')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 4. Resource Types
INSERT INTO public.resource_types (id, name, icon, description) VALUES
('notes', 'Revision & Chapter Notes', 'book-open', 'Concise chapter summaries, mindmaps, and study notes'),
('question-paper', 'Previous Question Papers', 'file-text', 'Official Board and Term examination question papers'),
('answer-key', 'Answer Keys & Solutions', 'check-circle', 'Detailed answer keys and step-by-step scoring schemes'),
('model-paper', 'Model Question Papers', 'copy', 'Practice and model question papers with expected marks'),
('worksheet', 'Worksheets & Question Banks', 'list-ordered', 'Chapter-wise solved exercises and question banks'),
('practical-manual', 'Practical Lab Manuals & Records', 'flask-conical', 'Lab manuals, experiments, and record work guides')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 5. Key Subjects
INSERT INTO public.subjects (id, class_id, stream_id, name, code, slug, description) VALUES
-- Plus Two
('plus-two-biology', 'plus-two', 'science', 'Biology (Botany & Zoology)', 'BIO12', 'biology', 'Higher Secondary Biology curriculum'),
('plus-two-physics', 'plus-two', 'science', 'Physics', 'PHY12', 'physics', 'Higher Secondary Physics syllabus and derivations'),
('plus-two-chemistry', 'plus-two', 'science', 'Chemistry', 'CHE12', 'chemistry', 'Organic, Inorganic and Physical Chemistry'),
('plus-two-mathematics', 'plus-two', 'science', 'Mathematics', 'MAT12', 'mathematics', 'Calculus, Vectors and Probability'),
('plus-two-computer-science', 'plus-two', 'science', 'Computer Science', 'CS12', 'computer-science', 'C++ and Database applications'),
('plus-two-accountancy', 'plus-two', 'commerce', 'Accountancy', 'ACC12', 'accountancy', 'Financial Accounting and Partnership accounts'),
('plus-two-economics', 'plus-two', 'commerce', 'Economics', 'ECO12', 'economics', 'Micro and Macro Economics for Plus Two'),
('plus-two-english', 'plus-two', 'general', 'English', 'ENG12', 'english', 'Common English curriculum'),

-- Plus One
('plus-one-physics', 'plus-one', 'science', 'Physics', 'PHY11', 'physics', 'Mechanics, Thermodynamics, and Waves'),
('plus-one-chemistry', 'plus-one', 'science', 'Chemistry', 'CHE11', 'chemistry', 'Chemical Bonding and States of Matter'),
('plus-one-biology', 'plus-one', 'science', 'Biology', 'BIO11', 'biology', 'Cell Biology and Plant Physiology'),
('plus-one-mathematics', 'plus-one', 'science', 'Mathematics', 'MAT11', 'mathematics', 'Trigonometry and Algebra'),

-- Class 10 / SSLC
('class-10-mathematics', 'class-10', 'general', 'Mathematics', 'MAT10', 'mathematics', 'SSLC Mathematics (Circles, Arithmetic Sequences, Trigonometry)'),
('class-10-physics', 'class-10', 'general', 'Physics', 'PHY10', 'physics', 'SSLC Physics (Electricity, Magnetism, Optics)'),
('class-10-chemistry', 'class-10', 'general', 'Chemistry', 'CHE10', 'chemistry', 'Periodic Table and Organic Chemistry for SSLC'),
('class-10-biology', 'class-10', 'general', 'Biology', 'BIO10', 'biology', 'Sensations and Genetic codes for SSLC'),
('class-10-social-science', 'class-10', 'general', 'Social Science', 'SS10', 'social-science', 'History, Geography and Civics')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 6. Sample Chapters
INSERT INTO public.chapters (id, subject_id, chapter_number, title, slug, description) VALUES
('c1000000-0000-0000-0000-000000000001', 'plus-two-biology', 1, 'Reproduction in Organisms', 'reproduction-in-organisms', 'Basics of biological reproduction modes'),
('c1000000-0000-0000-0000-000000000002', 'plus-two-biology', 2, 'Sexual Reproduction in Flowering Plants', 'flowering-plants-reproduction', 'Structure of flower and fertilization'),
('c1000000-0000-0000-0000-000000000003', 'plus-two-biology', 5, 'Principles of Inheritance and Variation', 'principles-of-inheritance', 'Mendelian genetics and chromosomes'),
('c1000000-0000-0000-0000-000000000004', 'plus-two-biology', 6, 'Molecular Basis of Inheritance', 'molecular-basis-of-inheritance', 'DNA structure, replication, transcription and translation'),
('c1000000-0000-0000-0000-000000000005', 'plus-two-physics', 1, 'Electric Charges and Fields', 'electric-charges-and-fields', 'Coulombs law and Gauss theorem'),
('c1000000-0000-0000-0000-000000000006', 'plus-two-physics', 3, 'Current Electricity', 'current-electricity', 'Ohms law, Kirchhoff rules, and Potentiometer'),
('c1000000-0000-0000-0000-000000000007', 'class-10-mathematics', 1, 'Arithmetic Sequences', 'arithmetic-sequences', 'nth term and algebraic forms of AP'),
('c1000000-0000-0000-0000-000000000008', 'class-10-mathematics', 2, 'Circles', 'circles', 'Chords, arcs, and tangents of circles')
ON CONFLICT (id) DO NOTHING;
