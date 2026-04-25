const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const notesDir = path.join(__dirname, '../frontend/public/notes');
if (!fs.existsSync(notesDir)) {
  fs.mkdirSync(notesDir, { recursive: true });
}

const doc = new PDFDocument({ margin: 50 });
doc.pipe(fs.createWriteStream(path.join(notesDir, 'shrm-certification.pdf')));

// Custom styling functions
const title = (text) => doc.fontSize(28).fillColor('#1E3A8A').text(text, { align: 'center' }).moveDown();
const header = (text) => doc.fontSize(20).fillColor('#1E40AF').text(text, { underline: true }).moveDown(0.5);
const subheader = (text) => doc.fontSize(16).fillColor('#1F2937').text(text).moveDown(0.3);
const body = (text) => doc.fontSize(12).fillColor('#4B5563').text(text, { align: 'justify' }).moveDown();
const list = (items) => {
  items.forEach(item => {
    doc.fontSize(12).fillColor('#4B5563').text(`• ${item}`, { indent: 20 }).moveDown(0.3);
  });
  doc.moveDown(0.5);
};
const newPage = () => doc.addPage();

// PAGE 1
title('SHRM CERTIFICATION - NOTES');

header('1. Introduction');
list([
  'SHRM = Society for Human Resource Management',
  'Global HR certification body',
  'Focus: Practical HR skills + decision-making',
  'Recognized worldwide'
]);

header('2. Types of Certifications');
subheader('SHRM-CP (Certified Professional)');
list([
  'For: Students / Freshers / HR Executives',
  'Focus: Operational HR',
  'Work: Recruitment, Employee relations, Payroll, HR policies'
]);

subheader('SHRM-SCP (Senior Certified Professional)');
list([
  'For: Managers / Leaders',
  'Focus: Strategic HR',
  'Work: Policy making, Leadership, Business strategy'
]);

header('3. Exam Pattern');
list([
  'Duration: ~4 hours',
  'Questions: ~134',
  'Type: MCQs, Scenario-based questions',
  'Focus: Real-life HR situations'
]);

newPage();

// PAGE 2
header('4. SHRM BASK (Syllabus)');
subheader('HR Knowledge Areas:');
list([
  'People',
  'Organization',
  'Workplace',
  'Strategy'
]);

subheader('Behavioral Competencies:');
list([
  'Leadership',
  'Communication',
  'Ethical practice',
  'Business acumen'
]);

header('5. Key HR Functions');
list([
  'Recruitment & Selection',
  'Training & Development',
  'Performance Management',
  'Compensation & Benefits',
  'Employee Relations'
]);

header('6. Important Concepts');
subheader('Employee Engagement');
body('Keeping employees motivated and satisfied.');
subheader('HR Analytics');
body('Using data for HR decisions.');
subheader('Talent Management');
body('Hiring + developing + retaining employees.');

header('7. Advantages');
list([
  'Global recognition',
  'Better job opportunities',
  'Salary growth',
  'Strong HR knowledge'
]);

header('8. Disadvantages');
list([
  'Expensive',
  'Needs preparation',
  'Requires practical understanding'
]);

newPage();

// PAGE 3
header('9. Career Path (Roadmap)');
subheader('Stage 1: Student');
list(['Learn HR basics', 'Do internships']);

subheader('Stage 2: Beginner HR');
list(['Learn recruitment, payroll', 'Prepare SHRM-CP']);

subheader('Stage 3: Experienced');
list(['Work in HR roles', 'Handle real cases']);

subheader('Stage 4: Leadership');
list(['Strategy & management', 'Prepare SHRM-SCP']);

header('10. Quick Revision Points');
list([
  'SHRM = Practical HR certification',
  'Two levels: CP & SCP',
  'Focus on real-world scenarios',
  'Covers HR + behavioral skills'
]);

header('11. Interview Quick Answers');
body('Q: What is SHRM?');
body('A: A global HR certification focusing on practical HR skills');
doc.moveDown(0.5);
body('Q: Difference between CP & SCP?');
body('A: CP = operational, SCP = strategic');
doc.moveDown(0.5);
body('Q: What does SHRM test?');
body('A: Decision-making in HR situations');
doc.moveDown(0.5);

header('12. Preparation Tips');
list([
  'Study HR basics',
  'Practice case studies',
  'Solve mock tests',
  'Focus on concepts, not memorization'
]);

doc.moveDown(3);
doc.fontSize(10).fillColor('#999999').text('Generated for CareerMind AI Students.', { align: 'center' });

doc.end();

console.log('SHRM Certification PDF Notes generated successfully!');
