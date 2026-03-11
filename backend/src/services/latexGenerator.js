import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function escapeLatex(str) {
  if (str == null || str === '') return '';
  return String(str)
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/[&%$#_{}]/g, '\\$&')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\n/g, '\\\\\n');
}

function sectionList(items, bullet = '\\item') {
  if (!items || !items.length) return '';
  return items.map((i) => `${bullet} ${escapeLatex(i)}`).join('\n');
}

function educationBlock(edu) {
  if (!edu || !edu.length) return '';
  return edu
    .map(
      (e) =>
        `\\textbf{${escapeLatex(e.degree || '')}} ${escapeLatex(e.institution || '')} ${escapeLatex(e.year || '')} ${escapeLatex(e.stream || '')} ${escapeLatex(e.percentage || '')}`
    )
    .join(' \\\\\n');
}

function skillsByCategory(skills) {
  if (!skills || !skills.length) return '';
  const byCat = {};
  skills.forEach((s) => {
    const cat = s.category || 'other';
    if (!byCat[cat]) byCat[cat] = [];
    (s.items || []).forEach((item) => byCat[cat].push(item));
  });
  const order = ['programming', 'fullstack', 'tools', 'certifications'];
  return order
    .filter((c) => byCat[c]?.length)
    .map((c) => `\\textbf{${c}}: ${(byCat[c] || []).map(escapeLatex).join(', ')}`)
    .join(' \\\\\n');
}

function projectBlock(proj) {
  if (!proj || !proj.title) return '';
  const lines = [];
  lines.push(`\\textbf{${escapeLatex(proj.title)}}`);
  if (proj.techStack?.length) lines.push(`\\textit{Tech: ${proj.techStack.map(escapeLatex).join(', ')}}`);
  if (proj.role) lines.push(`\\textbf{Role:} ${escapeLatex(proj.role)}`);
  if (proj.description) lines.push(escapeLatex(proj.description));
  if (proj.responsibilities?.length) lines.push(sectionList(proj.responsibilities));
  return lines.join(' \\\\\n');
}

function projectsList(projects) {
  if (!projects || !projects.length) return '';
  return projects
    .filter(p => p.title)
    .map(p => projectBlock(p))
    .join('\n\n\\vspace{8pt}\n\n');
}

function projectBlockModern(proj) {
  if (!proj || !proj.title) return '';
  const lines = [];
  lines.push(`{\\fontsize{11pt}{13pt}\\selectfont\\bfseries ${escapeLatex(proj.title)}} \\\\[2pt]`);
  if (proj.role) lines.push(`{\\fontsize{8.5pt}{10.5pt}\\selectfont\\color{accent}\\bfseries ${escapeLatex(proj.role)}} \\\\[4pt]`);
  if (proj.description) lines.push(`{\\fontsize{8.5pt}{11.5pt}\\selectfont ${escapeLatex(proj.description)}} \\\\[6pt]`);
  if (proj.responsibilities?.length) {
    lines.push(`\\begin{itemize}[leftmargin=*, label=\\textcolor{accent}{\\faAngleRight}, itemsep=1.5pt, topsep=0pt]`);
    lines.push(`{\\fontsize{8.5pt}{11pt}\\selectfont\\color{textmain} ${sectionList(proj.responsibilities)}}`);
    lines.push(`\\end{itemize}`);
  }
  return lines.join('\n');
}

function projectsListModern(projects) {
  if (!projects || !projects.length) return '';
  return projects
    .filter(p => p.title)
    .map(p => projectBlockModern(p))
    .join('\n\n\\vspace{10pt}\n\n');
}

function projectBlockClassic(proj) {
  if (!proj || !proj.title) return '';
  const lines = [];
  lines.push(`{\\fontsize{10pt}{12pt}\\selectfont\\bfseries\\color{dark} ${escapeLatex(proj.title)}} \\\\[2pt]`);
  if (proj.role) lines.push(`{\\fontsize{8.5pt}{10pt}\\selectfont\\color{accent}\\bfseries ${escapeLatex(proj.role)}} \\\\[4pt]`);
  if (proj.description) lines.push(`{\\fontsize{8.5pt}{11pt}\\selectfont ${escapeLatex(proj.description)}}`);
  return lines.join('\n');
}

function projectsListClassic(projects) {
  if (!projects || !projects.length) return '';
  return projects
    .filter(p => p.title)
    .map(p => projectBlockClassic(p))
    .join('\n\n\\vspace{8pt}\n\n');
}

function projectResponsibilitiesText(arr) {
  if (!arr?.length) return '';
  return arr.map(escapeLatex).join(' \\textbullet{} ');
}

function achievementsList(arr) {
  if (!arr?.length) return '\\item --';
  return arr.map((a) => `\\item ${escapeLatex(a.title || '')} ${escapeLatex(a.description || '')} (${escapeLatex(a.date || '')})`).join('\n');
}

function volunteeringList(arr) {
  if (!arr?.length) return '\\item --';
  return arr.map((v) => `\\item ${escapeLatex(v.organization || '')} - ${escapeLatex(v.role || '')} ${escapeLatex(v.description || '')}`).join('\n');
}

function sportsArtsList(arr) {
  if (!arr?.length) return '\\item --';
  return arr.map((s) => `\\item ${escapeLatex(s.name || '')} (${s.type}): ${escapeLatex(s.achievement || '')}`).join('\n');
}

function strengthsList(arr) {
  if (!arr?.length) return '\\item --';
  return arr.map((s) => `\\item ${escapeLatex(s.name || '')}: ${escapeLatex(s.description || '')}`).join('\n');
}

export function buildLatexData(dossier) {
  const p = dossier.profile || {};
  const projects = dossier.projects || (dossier.capstoneProject ? [dossier.capstoneProject] : []);
  const cp = projects[0] || {};

  let socialLine = '';
  if (p.linkedIn || p.github) {
    const parts = [];
    if (p.linkedIn) parts.push(`\\faLinkedin \\hspace{2pt} \\href{${p.linkedIn}}{LinkedIn}`);
    if (p.github) parts.push(`\\faGithub \\hspace{2pt} \\href{${p.github}}{GitHub}`);
    socialLine = `\\\\[4pt] ` + parts.join(' \\quad | \\quad ');
  }

  return {
    name: escapeLatex(p.name || ''),
    email: escapeLatex(p.email || ''),
    phone: escapeLatex(p.phone || ''),
    location: escapeLatex(p.location || ''),
    cognizantId: escapeLatex(p.cognizantId || ''),
    socialLine,
    role: escapeLatex(p.role || ''),
    track: escapeLatex(p.track || ''),
    education: educationBlock(dossier.education),
    technicalSkills: skillsByCategory(dossier.technicalSkills),
    projects: projectsList(projects),
    projectsModern: projectsListModern(projects),
    projectsClassic: projectsListClassic(projects),
    capstoneTitle: escapeLatex(cp.title || ''),
    capstoneRole: escapeLatex(cp.role || ''),
    capstoneDescription: escapeLatex(cp.description || ''),
    capstoneResponsibilities: sectionList(cp.responsibilities || []),
    capstoneResponsibilitiesText: projectResponsibilitiesText(cp.responsibilities || []),
    achievements: achievementsList(dossier.achievements),
    volunteering: volunteeringList(dossier.volunteering),
    sportsArts: sportsArtsList(dossier.sportsArts),
    strengths: strengthsList(dossier.strengths),
  };
}

const TEMPLATES_DIR = path.join(__dirname, '..', 'templates', 'latex');

export function getLatexTemplate(templateId) {
  const file = path.join(TEMPLATES_DIR, `${templateId || 'classic'}.tex`);
  if (!fs.existsSync(file)) {
    if (templateId === 'modern') return getModernLatexContent();
    if (templateId === 'executive') return getExecutiveLatexContent();
    return getClassicLatexContent();
  }
  return fs.readFileSync(file, 'utf-8');
}

function getExecutiveLatexContent() {
  return `\\documentclass[11pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[top=0.6in, bottom=0.6in, left=0.75in, right=0.75in]{geometry}
\\usepackage{xcolor}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{fancyhdr}
\\usepackage{array}
\\usepackage{microtype}
\\usepackage{fontawesome5}

\\definecolor{darkblue}{RGB}{26, 54, 93}
\\definecolor{lightblue}{RGB}{37, 99, 235}
\\definecolor{mediumgray}{RGB}{107, 114, 128}

\\hypersetup{colorlinks=true, urlcolor=lightblue, hidelinks}
\\pagestyle{empty}
\\usepackage[default,scale=0.95]{opensans}
\\setlength{\\parindent}{0pt}
\\setlength{\\parskip}{2pt}

\\begin{document}

\\noindent
{\\fontsize{26pt}{28pt}\\selectfont\\textbf{\\color{darkblue}<<name>>}}

\\vspace{2pt}
{\\Large\\color{lightblue}\\textbf{<<role>>}}\\quad{\\small\\color{darkgray}<<track>>}

\\vspace{4pt}
{\\footnotesize\\color{mediumgray}
  \\href{mailto:<<email>>}{<<email>>} \\quad $\\bullet$ \\quad <<phone>> \\quad $\\bullet$ \\quad <<location>> \\quad $\\bullet$ \\quad CTS ID: <<cognizantId>> <<socialLine>>
}

\\vspace{8pt}
{\\color{darkblue}\\hrule height 1pt}
\\vspace{10pt}

\\textbf{EDUCATION} \\\\
<<education>>

\\vspace{10pt}
\\textbf{SKILLS} \\\\
<<technicalSkills>>

\\vspace{10pt}
\\textbf{PROJECTS} \\
<<projects>>

\end{document}`;
}

function getModernLatexContent() {
  return `\\documentclass[10pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[margin=0in]{geometry}
\\usepackage{xcolor}
\\usepackage{tikz}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{fontawesome5}
\\usepackage[most]{tcolorbox}
\\usepackage{noto}

\\definecolor{sidebg}{RGB}{248, 250, 252}
\\definecolor{primary}{RGB}{37, 99, 235}
\\definecolor{dark}{RGB}{15, 23, 42}
\\definecolor{accent}{RGB}{14, 165, 233}
\\definecolor{textmain}{RGB}{30, 41, 59}

\\tcbset{
    sidebar/.style={colback=sidebg, colframe=sidebg, sharp corners, boxrule=0pt, top=25pt, bottom=25pt, left=15pt, right=15pt, height=\\paperheight, width=0.30\\paperwidth, nobeforeafter},
    main/.style={colback=white, colframe=white, sharp corners, boxrule=0pt, top=25pt, bottom=25pt, left=20pt, right=20pt, height=\\paperheight, width=0.70\\paperwidth, nobeforeafter}
}

\\pagestyle{empty}

\\begin{document}

\\begin{tcolorbox}[sidebar]
    \\begin{center}
        \\begin{tikzpicture}
            \\draw[primary, line width=1.5pt, rounded corners=10pt] (0,0) rectangle (2,2);
            \\node at (1,1) {\\fontsize{30pt}{30pt}\\selectfont\\color{gray!50}\\faUser};
        \\end{tikzpicture}
    \\end{center}
    
    \\vspace{10pt}
    
    {\\fontsize{9.5pt}{11pt}\\selectfont\\bfseries\\color{primary}\\uppercase{Contact}} \\\\[6pt]
    {\\fontsize{8pt}{10.5pt}\\selectfont\\color{textmain}
        \\faEnvelope \\hspace{4pt} \\href{mailto:<<email>>}{<<email>>} \\\\[5pt]
        \\faPhone \\hspace{4pt} <<phone>> \\\\[5pt]
        \\faMapMarker* \\hspace{4pt} <<location>> \\\\[5pt]
        \\faIdBadge \\hspace{4pt} ID: <<cognizantId>> \\\\[8pt]
        <<socialLine>>
    }

    \\vspace{15pt}
    {\\fontsize{9.5pt}{11pt}\\selectfont\\bfseries\\color{primary}\\uppercase{Education}} \\\\[6pt]
    {\\fontsize{8pt}{10pt}\\selectfont\\color{textmain} <<education>>}

    \\vspace{15pt}
    {\\fontsize{9.5pt}{11pt}\\selectfont\\bfseries\\color{primary}\\uppercase{Strengths}} \\\\[6pt]
    \\begin{itemize}[leftmargin=*, label=\\textcolor{primary}{\\faCheckCircle}, itemsep=1.5pt, topsep=0pt]
        {\\fontsize{8pt}{10pt}\\selectfont\\color{textmain} <<strengths>>}
    \\end{itemize}
\\end{tcolorbox}%
\\begin{tcolorbox}[main]
    {\\fontsize{26pt}{30pt}\\selectfont\\bfseries\\color{dark} <<name>>} \\\\[5pt]
    {\\fontsize{13pt}{15pt}\\selectfont\\bfseries\\color{primary} <<role>>} \\\\[3pt]
    {\\fontsize{10pt}{12pt}\\selectfont\\color{accent}\\bfseries <<track>>}
    
    \\vspace{15pt}
    
    {\\fontsize{13pt}{15pt}\\selectfont\\bfseries\\color{dark} Professional Profile} \\vspace{3pt} \\hrule \\vspace{6pt}
    {\\fontsize{9.5pt}{13pt}\\selectfont\\color{textmain}
        A highly motivated \\textbf{<<role>>} specializing in \\textbf{<<track>>}. Dedicated to leveraging technical expertise to build innovative solutions and contribute to organizational success.
    }

    \\vspace{15pt}
    {\\fontsize{13pt}{15pt}\\selectfont\\bfseries\\color{dark} Professional Projects} \\vspace{3pt} \\hrule \\vspace{6pt}
    <<projectsModern>>

    \\vspace{15pt}
    {\\fontsize{13pt}{15pt}\\selectfont\\bfseries\\color{dark} Technical Expertise} \\vspace{3pt} \\hrule \\vspace{6pt}
    {\\fontsize{9pt}{12pt}\\selectfont\\color{textmain} <<technicalSkills>>}

    \\vspace{15pt}
    {\\fontsize{13pt}{15pt}\\selectfont\\bfseries\\color{dark} Achievements} \\vspace{3pt} \\hrule \\vspace{6pt}
    \\begin{itemize}[leftmargin=*, label=\\textcolor{primary}{\\faTrophy}, itemsep=3pt, topsep=0pt]
        {\\fontsize{9pt}{12pt}\\selectfont\\color{textmain} <<achievements>>}
    \\end{itemize}
\\end{tcolorbox}

\\end{document}`;
}


function getClassicLatexContent() {
  return `\\documentclass[10pt,a4paper]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage[top=0.25in, bottom=0.25in, left=0.35in, right=0.35in]{geometry}
\\usepackage{xcolor}
\\usepackage{hyperref}
\\usepackage{enumitem}
\\usepackage{multicol}
\\usepackage{tcolorbox}
\\usepackage{fontawesome5}
\\usepackage{titlesec}
\\usepackage{noto}
\\usepackage{tikz}

\\definecolor{primary}{RGB}{79, 70, 229}
\\definecolor{dark}{RGB}{15, 23, 42}
\\definecolor{accent}{RGB}{14, 165, 233}

\\tcbset{
    hero/.style={colback=dark, colframe=dark, sharp corners, fontupper=\\color{white}, boxrule=0pt, top=20pt, bottom=20pt, left=30pt, right=30pt},
    card/.style={colback=white, colframe=gray!10, boxrule=0.5pt, rounded corners=10pt, top=6pt, bottom=6pt, left=10pt, right=10pt, shadow={1pt}{-1pt}{0pt}{black!5}},
    project/.style={colback=dark, colframe=dark, rounded corners=12pt, fontupper=\\color{white}, top=12pt, bottom=12pt, left=12pt, right=12pt}
}

\\titleformat{\\section}{\\fontsize{14pt}{16pt}\\selectfont\\bfseries\\color{dark}}{}{0em}{}[\\vspace{-4pt}\\rule{\\textwidth}{0.5pt}]
\\titlespacing{\\section}{0pt}{10pt}{6pt}
\\pagestyle{empty}

\\begin{document}

\\begin{tcolorbox}[hero]
    \\begin{minipage}[c]{0.80\\linewidth}
        {\\fontsize{28pt}{32pt}\\selectfont\\bfseries <<name>>} \\\\[2pt]
        {\\fontsize{12pt}{14pt}\\selectfont\\bfseries\\color{accent}\\uppercase <<role>>} \\\\[8pt]
        {\\fontsize{8.5pt}{10pt}\\selectfont\\color{gray!60}
          \\faEnvelope \\hspace{2pt} \\href{mailto:<<email>>}{<<email>>} \\quad | \\quad 
          \\faPhone \\hspace{2pt} <<phone>> \\quad | \\quad 
          \\faMapMarker* \\hspace{2pt} <<location>> \\quad | \\quad 
          \\faIdBadge \\hspace{2pt} ID: <<cognizantId>> <<socialLine>>
        }
    \\end{minipage}%
    \\begin{minipage}[c]{0.20\\linewidth}
        \\flushright
        \\begin{tikzpicture}
            \\draw[gray!60, line width=1.5pt, rounded corners=5pt] (0,0) rectangle (2,2);
            \\node at (1,1) {\\color{gray!60}\\fontsize{20pt}{20pt}\\selectfont\\faUser};
        \\end{tikzpicture}
    \\end{minipage}
\\end{tcolorbox}

\\vspace{10pt}

\\begin{multicols}{2}
    \\columnsep=20pt
    
    \\section*{Professional Projects}
    <<projectsClassic>>

    \\section*{Education}
    {\\fontsize{9pt}{11pt}\\selectfont <<education>>}

    \\newpage

    \\section*{Technical Expertise}
    \\begin{tcolorbox}[card]
        {\\fontsize{8.5pt}{11pt}\\selectfont <<technicalSkills>>}
    \\end{tcolorbox}

   \section*{Achievements}
{\fontsize{8.5pt}{10pt}\selectfont
\begin{itemize}[leftmargin=0em, label=\textcolor{primary}{\faTrophy}, itemsep=2pt]
<<achievements>>
\end{itemize}
}

    \\section*{Core Strengths}
    \\begin{itemize}[leftmargin=*, label=\\textcolor{accent}{\\faCheckCircle}, itemsep=1pt, topsep=0pt, parsep=0pt]
        {\\fontsize{8.5pt}{10pt}\\selectfont <<strengths>>}
    \\end{itemize}
\\end{multicols}

\\end{document}`;
}

export function renderLatex(dossier, templateId) {
  const data = buildLatexData(dossier);
  let content = getLatexTemplate(templateId);
  Object.entries(data).forEach(([key, value]) => {
    content = content.replace(new RegExp(`<<${key}>>`, 'g'), value);
  });
  return content;
}
