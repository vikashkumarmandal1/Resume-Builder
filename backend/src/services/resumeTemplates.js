function escapeHtml(str) {
  if (str == null || str === '') return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function section(items, fn) {
  if (!items?.length) return '';
  return items.map(fn).join('');
}

function getData(dossier) {
  const p = dossier.profile || {};
  const skills = dossier.technicalSkills || [];
  const byCat = {};
  skills.forEach((s) => {
    const cat = s.category || 'other';
    if (!byCat[cat]) byCat[cat] = [];
    (s.items || []).forEach((i) => byCat[cat].push(i));
  });
  const order = ['programming', 'fullstack', 'tools', 'certifications'];
  const projects = dossier.projects || (dossier.capstoneProject ? [dossier.capstoneProject] : []);
  return {
    name: escapeHtml(p.name || ''),
    email: escapeHtml(p.email || ''),
    phone: escapeHtml(p.phone || ''),
    location: escapeHtml(p.location || ''),
    cognizantId: escapeHtml(p.cognizantId || ''),
    photoUrl: p.photoUrl || '',
    linkedIn: escapeHtml(p.linkedIn || ''),
    github: escapeHtml(p.github || ''),
    role: escapeHtml(p.role || ''),
    track: escapeHtml(p.track || ''),
    education: dossier.education || [],
    skillGroups: order.filter((c) => byCat[c]?.length).map((c) => ({ name: c, items: byCat[c] || [] })),
    capstone: projects[0] || {},
    projects: projects,
    achievements: dossier.achievements || [],
    volunteering: dossier.volunteering || [],
    sportsArts: dossier.sportsArts || [],
    strengths: dossier.strengths || [],
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   CLASSIC – Premium Web Portfolio Design
───────────────────────────────────────────────────────────────────────────── */
function classicTemplate(d) {
  const edu = section(
    d.education,
    (e) => `
    <div class="card glass">
      <div class="card-header">
        <h3 class="card-title">${escapeHtml(e.degree)}</h3>
        <span class="badge primary">${e.year ? escapeHtml(e.year) : ''}</span>
      </div>
      <div class="card-subtitle">${escapeHtml(e.institution)}</div>
      <div class="card-meta">
        <span class="tag small">${escapeHtml(e.stream || '')}</span>
        ${e.percentage ? `<span class="score">Result: ${escapeHtml(e.percentage)}%</span>` : ''}
      </div>
    </div>`
  );

  const skillEntries = section(
    d.skillGroups,
    (g) => `
    <div class="skill-category">
      <h4 class="skill-label">${escapeHtml(g.name)}</h4>
      <div class="tag-cloud">
        ${(g.items || []).map(item => `<span class="skill-tag">${escapeHtml(item)}</span>`).join('')}
      </div>
    </div>`
  );

  const ach = section(
    d.achievements,
    (a) => `
    <div class="award-item">
      <div class="award-icon">🏆</div>
      <div class="award-content">
        <div class="award-title">${escapeHtml(a.title)}</div>
        ${a.description ? `<div class="award-desc">${escapeHtml(a.description)}</div>` : ''}
      </div>
    </div>`
  );

  const projectsHtml = section(
    d.projects,
    (proj) => proj.title
      ? `<div class="project-showcase" style="margin-bottom: 20px;">
           <div class="project-content">
             <h3 class="project-name">${escapeHtml(proj.title)}</h3>
             <div class="project-role-badge">${escapeHtml(proj.role)}</div>
             <p class="project-desc">${escapeHtml(proj.description || '')}</p>
             <div class="project-tech-bar">
               ${(proj.techStack || []).map(t => `<span class="tech-pill">${escapeHtml(t)}</span>`).join('')}
             </div>
             ${(proj.responsibilities || []).length ? `
               <ul class="project-bullets">
                 ${(proj.responsibilities || []).slice(0, 3).map((r) => `<li>${escapeHtml(r)}</li>`).join('')}
               </ul>` : ''}
           </div>
         </div>`
      : ''
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${d.name} | Professional Portfolio</title>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #4F46E5;
      --primary-soft: #EEF2FF;
      --accent: #0EA5E9;
      --dark: #0F172A;
      --text: #1E293B;
      --muted: #475569;
      --white: #FFFFFF;
      --glass: rgba(255, 255, 255, 0.8);
      --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      --shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 10pt; line-height: 1.6; color: var(--text);
      background-color: #F8FAFC;
      background-image: radial-gradient(at 0% 0%, #EEF2FF 0, transparent 50%), 
                        radial-gradient(at 50% 0%, #F0F9FF 0, transparent 50%);
    }
    .hero {
      background: var(--dark); color: var(--white);
      padding: 30px 50px; display: flex; align-items: center; gap: 30px;
      position: relative; overflow: hidden; border-bottom: 4px solid var(--primary);
    }
    .profile-img {
      width: 110px; height: 110px; border-radius: 24px;
      object-fit: cover; border: 3px solid rgba(255,255,255,0.1);
      box-shadow: 0 15px 20px -5px rgb(0 0 0 / 0.1);
      background: #1E293B; flex-shrink: 0;
    }
    .hero-content { flex: 1; }
    .hero-name {
      font-family: 'Outfit', sans-serif; font-size: 30pt; font-weight: 700;
      letter-spacing: -1.5px; line-height: 1; margin-bottom: 4px;
      background: linear-gradient(to right, #fff, #E2E8F0);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    .hero-role {
      font-family: 'Outfit', sans-serif; font-size: 12pt; font-weight: 600;
      color: var(--accent); text-transform: uppercase; letter-spacing: 3px; margin-bottom: 12px;
    }
    .hero-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .contact-badge, .contact-link {
      display: flex; align-items: center; gap: 6px; font-size: 8.5pt;
      background: rgba(255,255,255,0.05); padding: 6px 12px; border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.1); color: #E2E8F0; text-decoration: none;
    }
    .container { max-width: 1000px; margin: 20px auto; padding: 0 40px; }
    .main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 25px; }
    .section { margin-bottom: 25px; }
    .section-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .section-title {
      font-family: 'Outfit', sans-serif; font-size: 15pt; font-weight: 700;
      color: var(--dark); letter-spacing: -0.5px;
    }
    .line { flex: 1; height: 1px; background: #E2E8F0; }
    .card {
      background: var(--white); padding: 15px; border-radius: 16px;
      border: 1px solid #F1F5F9; box-shadow: var(--shadow-sm); margin-bottom: 10px;
    }
    .card.glass { background: var(--glass); backdrop-filter: blur(10px); }
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
    .card-title { font-size: 10.5pt; font-weight: 700; color: var(--dark); }
    .badge { padding: 3px 10px; border-radius: 8px; font-size: 7.5pt; font-weight: 700; }
    .badge.primary { background: var(--primary-soft); color: var(--primary); }
    .card-subtitle { font-size: 9.5pt; font-weight: 600; color: var(--muted); margin-bottom: 6px; }
    .card-meta { display: flex; align-items: center; justify-content: space-between; }
    .tag { padding: 3px 8px; background: #F8FAFC; border-radius: 6px; font-size: 8pt; color: var(--muted); font-weight: 600; }
    .score { font-weight: 800; color: var(--primary); font-size: 8.5pt; }
    .skill-category { margin-bottom: 15px; }
    .skill-label { font-size: 8pt; font-weight: 800; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
    .tag-cloud { display: flex; flex-wrap: wrap; gap: 6px; }
    .skill-tag { background: var(--white); padding: 5px 12px; border-radius: 10px; font-size: 8.5pt; font-weight: 600; color: var(--dark); box-shadow: var(--shadow-sm); border: 1px solid #F1F5F9; }
    .project-showcase { padding: 15px; border-radius: 16px; position: relative; border: 1px solid #F1F5F9; background: var(--white); }
    .project-name { font-size: 13pt; font-weight: 800; color: var(--dark); margin-bottom: 4px; }
    .project-role-badge { display: inline-block; color: var(--primary); font-weight: 700; font-size: 8.5pt; margin-bottom: 8px; }
    .project-desc { font-size: 9pt; color: var(--text); margin-bottom: 12px; line-height: 1.5; }
    .project-tech-bar { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
    .tech-pill { background: var(--primary-soft); border: 1px solid var(--primary-soft); padding: 3px 10px; border-radius: 6px; font-size: 7.5pt; font-weight: 600; color: var(--primary); }
    .project-bullets { padding-left: 18px; }
    .project-bullets li { font-size: 9pt; color: var(--text); margin-bottom: 4px; }
    .award-item { display: flex; gap: 12px; margin-bottom: 10px; background: #fff; padding: 12px; border-radius: 14px; border: 1px solid #F1F5F9; }
    .award-icon { font-size: 16pt; }
    .award-title { font-weight: 700; color: var(--dark); font-size: 9.5pt; }
    .award-desc { font-size: 8.5pt; color: var(--muted); }
    @media print {
      body { background: #fff; }
      .hero { padding: 25px 40px; border: none; }
      .card, .award-item { box-shadow: none; border: 1px solid #E2E8F0; }
    }
  </style>
</head>
<body>
  <header class="hero">
    ${d.photoUrl ? `<img src="${d.photoUrl}" class="profile-img">` : `
      <div class="profile-img" style="display: flex; align-items: center; justify-content: center; font-size: 40pt; font-weight: 800; color: rgba(255,255,255,0.1);">
        ${d.name.charAt(0)}
      </div>
    `}
    <div class="hero-content">
      <h1 class="hero-name">${d.name}</h1>
      <div class="hero-role">${d.role}</div>
      <div class="hero-grid">
        <a href="mailto:${d.email}" class="contact-link">📧 ${d.email}</a>
        <div class="contact-badge">📱 ${d.phone}</div>
        <div class="contact-badge">📍 ${d.location}</div>
        <div class="contact-badge">🆔 ID: ${d.cognizantId}</div>
        ${d.linkedIn ? `<a href="${d.linkedIn}" target="_blank" class="contact-link">🔗 LinkedIn</a>` : ''}
        ${d.github ? `<a href="${d.github}" target="_blank" class="contact-link">💻 GitHub</a>` : ''}
      </div>
    </div>
  </header>
  <div class="container">
    <div class="main-grid">
      <div class="left-col">
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Projects</h2>
            <div class="line"></div>
          </div>
          ${projectsHtml}
        </section>
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Education</h2>
            <div class="line"></div>
          </div>
          ${edu}
        </section>
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">Professional Achievements</h2>
            <div class="line"></div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
            ${ach}
          </div>
        </section>
      </div>
      <div class="right-col">
        <section class="section">
          <div class="section-header"><h2 class="section-title">Skills</h2></div>
          <div class="card glass">${skillEntries}</div>
        </section>
        <section class="section">
          <div class="section-header"><h2 class="section-title">Strengths</h2></div>
          <div class="tag-cloud">
            ${section(d.strengths, (s) => `<span class="skill-tag" style="background: var(--primary-soft); color: var(--primary); border: none;">${escapeHtml(s.name)}</span>`)}
          </div>
        </section>
        <section class="section">
          <div class="section-header"><h2 class="section-title">Activities</h2></div>
          ${section(d.sportsArts, (s) => `
            <div class="card" style="padding: 12px; margin-bottom: 10px; display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 16pt;">${s.type === 'sports' ? '🏀' : '🎨'}</span>
              <div>
                <div style="font-size: 9pt; font-weight: 700; color: var(--dark);">${escapeHtml(s.name)}</div>
                <div style="font-size: 8pt; color: var(--muted);">${escapeHtml(s.achievement || s.type)}</div>
              </div>
            </div>
          `)}
        </section>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODERN – Stylish Sidebar Portfolio Design
───────────────────────────────────────────────────────────────────────────── */
function modernTemplate(d) {
  const edu = section(
    d.education,
    (e) => `
    <div class="side-item">
      <div class="side-item-title">${escapeHtml(e.degree)}</div>
      <div class="side-item-meta">${escapeHtml(e.institution)}</div>
      <div class="side-item-year">${e.year ? escapeHtml(e.year) : ''}</div>
    </div>`
  );

  const skillEntries = section(
    d.skillGroups,
    (g) => `
    <div class="skill-row">
      <div class="skill-name">${escapeHtml(g.name)}</div>
      <div class="skill-tags">${(g.items || []).map(escapeHtml).join(', ')}</div>
    </div>`
  );

  const projectsHtml = section(
    d.projects,
    (proj) => proj.title
      ? `<div class="project-card">
           <h3>${escapeHtml(proj.title)}</h3>
           <div class="role">${escapeHtml(proj.role)}</div>
           <div class="desc">${escapeHtml(proj.description)}</div>
           ${(proj.responsibilities || []).length ? `
             <ul class="project-list" style="margin-top: 8px; padding-left: 15px; font-size: 8.5pt; color: var(--text);">
               ${proj.responsibilities.map(r => `<li style="margin-bottom: 4px;">${escapeHtml(r)}</li>`).join('')}
             </ul>
           ` : ''}
         </div>`
      : ''
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${d.name} | Modern Portfolio</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #2563eb; --accent: #0ea5e9; --dark: #0f172a; --side-bg: #f8fafc;
      --text: #1e293b; --text-dark: #0f172a; --white: #ffffff; --muted: #475569;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', sans-serif; font-size: 9.5pt;
      line-height: 1.4; color: var(--text); background: var(--white);
    }
    .wrapper { display: flex; min-height: 100vh; }
    .sidebar { width: 30%; background: var(--side-bg); padding: 20px 15px; border-right: 1px solid #e2e8f0; }
    .profile-photo {
      width: 90px; height: 90px; background: #e2e8f0; border-radius: 16px;
      margin: 0 auto 15px; overflow: hidden; display: flex; align-items: center;
      justify-content: center; border: 2px solid #fff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
    }
    .profile-photo img { width: 100%; height: 100%; object-fit: cover; }
    .side-section { margin-bottom: 20px; }
    .side-title {
      font-family: 'Outfit', sans-serif; font-size: 9.5pt; font-weight: 700;
      color: var(--primary); text-transform: uppercase; letter-spacing: 1px;
      margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1.5px solid #e2e8f0;
    }
    .contact-item { margin-bottom: 6px; font-size: 8pt; display: flex; align-items: center; gap: 6px; color: var(--text); text-decoration: none; }
    .side-item { margin-bottom: 8px; }
    .side-item-title { font-weight: 700; color: var(--text-dark); font-size: 8.5pt; }
    .side-item-meta { font-size: 8pt; color: var(--text); margin-top: 1px; }
    .side-item-year { font-weight: 700; color: var(--primary); font-size: 8pt; margin-top: 1px; }
    .main { width: 70%; padding: 25px 30px; }
    .header-name { font-family: 'Outfit', sans-serif; font-size: 26pt; font-weight: 800; color: var(--dark); letter-spacing: -1px; line-height: 1.1; margin-bottom: 4px; }
    .header-role { font-family: 'Outfit', sans-serif; font-size: 13pt; font-weight: 600; color: var(--primary); margin-bottom: 2px; }
    .header-track { font-size: 10pt; font-weight: 600; color: var(--accent); }
    .main-section { margin-bottom: 20px; }
    .main-title {
      font-family: 'Outfit', sans-serif; font-size: 13pt; font-weight: 700;
      color: var(--dark); margin-bottom: 8px; display: flex; align-items: center; gap: 10px;
    }
    .main-title::after { content: ''; flex: 1; height: 1px; background: #f1f5f9; }
    .summary-card { background: #f8fafc; padding: 12px; border-radius: 10px; line-height: 1.5; font-size: 9.5pt; border-left: 3px solid var(--primary); }
    .project-card { background: #f8fafc; color: var(--text); padding: 15px; border-radius: 12px; margin-bottom: 12px; border-left: 4px solid var(--accent); }
    .project-card h3 { font-size: 11pt; color: var(--text-dark); margin-bottom: 3px; }
    .project-card .role { color: var(--primary); font-weight: 700; font-size: 8pt; margin-bottom: 6px; }
    .project-card .desc { font-size: 8.5pt; color: #475569; line-height: 1.4; }
    .skill-row { margin-bottom: 8px; }
    .skill-name { font-weight: 700; font-size: 8pt; text-transform: uppercase; color: #64748b; margin-bottom: 2px; }
    .skill-tags { font-size: 9pt; color: var(--text-dark); }
    .list-item { display: flex; gap: 8px; margin-bottom: 6px; }
    .list-dot { width: 4px; height: 4px; background: var(--primary); border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
    @media print {
      body { -webkit-print-color-adjust: exact; }
      .sidebar { background: var(--side-bg) !important; }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <aside class="sidebar">
      <div class="profile-photo">
        ${d.photoUrl ? `<img src="${d.photoUrl}">` : `<span class="placeholder">${d.name.charAt(0)}</span>`}
      </div>
      <div class="side-section">
        <h2 class="side-title">Contact</h2>
        <a href="mailto:${d.email}" class="contact-item">📧 ${d.email}</a>
        <div class="contact-item">📱 ${d.phone}</div>
        <div class="contact-item">📍 ${d.location}</div>
        <div class="contact-item">🆔 ID: ${d.cognizantId}</div>
        ${d.linkedIn ? `<a href="${d.linkedIn}" target="_blank" class="contact-item">🔗 LinkedIn</a>` : ''}
        ${d.github ? `<a href="${d.github}" target="_blank" class="contact-item">💻 GitHub</a>` : ''}
      </div>
      <div class="side-section"><h2 class="side-title">Education</h2>${edu}</div>
      <div class="side-section">
        <h2 class="side-title">Strengths</h2>
        ${section(d.strengths, (s) => `<div class="side-item"><div class="side-item-title">${escapeHtml(s.name)}</div></div>`)}
      </div>
    </aside>
    <main class="main">
      <header>
        <h1 class="header-name">${d.name}</h1>
        <div class="header-role">${d.role}</div>
        <div class="header-track">${d.track}</div>
      </header>
      <section class="main-section">
        <h2 class="main-title">Profile</h2>
        <div class="summary-card">Driven <strong>${d.role}</strong> with a specialized focus on <strong>${d.track}</strong>.</div>
      </section>
      <section class="main-section">
        <h2 class="main-title">Projects</h2>
        ${projectsHtml}
      </section>
      <section class="main-section"><h2 class="main-title">Expertise</h2>${skillEntries}</section>
      <section class="main-section">
        <h2 class="main-title">Achievements</h2>
        ${section(d.achievements, (a) => `
          <div class="list-item"><div class="list-dot"></div><div>
            <div style="font-weight: 700; color: var(--text-dark);">${escapeHtml(a.title)}</div>
            <div style="font-size: 8.5pt; color: var(--muted);">${escapeHtml(a.description)}</div>
          </div></div>
        `)}
      </section>
    </main>
  </div>
</body>
</html>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   EXECUTIVE – Clean Professional Resume Design
───────────────────────────────────────────────────────────────────────────── */
function executiveTemplate(d) {
  const edu = section(
    d.education,
    (e) => `
    <div class="edu-item">
      <div class="edu-header">
        <div class="edu-degree">${escapeHtml(e.degree)}</div>
        <div class="edu-date">${e.year ? escapeHtml(e.year) : ''}</div>
      </div>
      <div class="edu-detail">${escapeHtml(e.institution)}${e.stream ? ` • ${escapeHtml(e.stream)}` : ''}</div>
      ${e.percentage ? `<div class="edu-gpa">GPA: ${escapeHtml(e.percentage)}</div>` : ''}
    </div>`
  );

  const skillBlocks = section(
    d.skillGroups,
    (g) => `
    <div class="skill-item">
      <div class="skill-cat">${escapeHtml(g.name)}</div>
      <div class="skill-list">${(g.items || []).map(escapeHtml).join(', ')}</div>
    </div>`
  );

  const projectsHtml = section(
    d.projects,
    (proj) => proj.title
      ? `<div class="project-block">
           <div class="project-header">
             <div class="project-title">${escapeHtml(proj.title)}</div>
             ${proj.role ? `<div class="project-role">${escapeHtml(proj.role)}</div>` : ''}
           </div>
           ${proj.techStack?.length ? `<div class="project-tech"><strong>Tech Stack:</strong> ${(proj.techStack || []).map(escapeHtml).join(', ')}</div>` : ''}
           ${proj.description ? `<div class="project-desc" style="font-size: 9.5pt; margin-bottom: 8px;">${escapeHtml(proj.description)}</div>` : ''}
           ${(proj.responsibilities || []).length ? `<ul class="project-list">${(proj.responsibilities || []).map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : ''}
           ${(proj.outcomes || []).length ? `<div class="project-outcomes"><strong>Key Outcomes:</strong> ${(proj.outcomes || []).map(escapeHtml).join(', ')}</div>` : ''}
         </div>`
      : ''
  );

  const ach = section(
    d.achievements,
    (a) => `
    <div class="item-row">
      <div class="item-title">${escapeHtml(a.title)}</div>
      ${a.date ? `<div class="item-date">${escapeHtml(a.date)}</div>` : ''}
      ${a.description ? `<div class="item-desc">${escapeHtml(a.description)}</div>` : ''}
    </div>`
  );

  const vol = section(
    d.volunteering,
    (v) => `
    <div class="vol-item">
      <div class="vol-header">
        <div class="vol-org">${escapeHtml(v.organization)}</div>
        <div class="vol-role">${escapeHtml(v.role)}</div>
      </div>
      ${v.description ? `<div class="vol-desc">${escapeHtml(v.description)}</div>` : ''}
    </div>`
  );

  const sports = section(
    d.sportsArts,
    (s) => `
    <div class="item-row">
      <div class="item-title">${escapeHtml(s.name)}</div>
      ${s.level ? `<div class="item-level">${escapeHtml(s.level)}</div>` : ''}
      ${s.achievement ? `<div class="item-desc">${escapeHtml(s.achievement)}</div>` : ''}
    </div>`
  );

  const str = section(
    d.strengths,
    (s) => `<span class="strength-tag">${escapeHtml(s.name)}</span>`
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${d.name} — Professional Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary: #1a365d; --secondary: #2d3748; --accent: #2563eb; --accent-light: #dbeafe;
      --gray-50: #f9fafb; --gray-100: #f3f4f6; --gray-300: #d1d5db; --gray-500: #6b7280;
      --gray-700: #374151; --gray-900: #111827; --white: #ffffff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif; font-size: 10.5pt; line-height: 1.5;
      color: var(--gray-900); background: var(--white); max-width: 8.5in; margin: 0 auto; padding: 0.5in;
    }
    .header { border-bottom: 2px solid var(--primary); padding-bottom: 12px; margin-bottom: 16px; }
    .header-name { font-family: 'Merriweather', serif; font-size: 24pt; font-weight: 700; color: var(--primary); }
    .header-title { font-size: 11pt; font-weight: 600; color: var(--accent); margin-bottom: 6px; }
    .header-contact { display: flex; flex-wrap: wrap; gap: 12px; font-size: 9pt; color: var(--gray-700); }
    .section { margin-bottom: 14px; page-break-inside: avoid; }
    .section-title { font-size: 11pt; font-weight: 700; color: var(--primary); border-bottom: 1px solid var(--gray-300); padding-bottom: 4px; margin-bottom: 8px; text-transform: uppercase; }
    .edu-item { margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px solid var(--gray-100); }
    .skills-container { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .project-block { background: var(--gray-50); border-left: 3px solid var(--accent); padding: 10px 12px; margin-bottom: 10px; }
    .project-header { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .project-title { font-weight: 700; font-size: 10.5pt; color: var(--primary); }
    .project-tech { font-size: 9pt; color: var(--gray-700); margin-bottom: 4px; }
    .project-list { margin: 4px 0 0 14px; font-size: 9.5pt; }
    .item-row { margin-bottom: 8px; padding-bottom: 6px; border-bottom: 1px solid var(--gray-100); }
    .strength-tag { display: inline-block; background: var(--accent-light); color: var(--primary); font-size: 9pt; font-weight: 600; padding: 4px 10px; border-radius: 4px; }
    @media print { body { max-width: 100%; margin: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-name">${d.name}</div>
    <div class="header-title">${d.role}${d.track ? ' • ' + d.track : ''}</div>
    <div class="header-contact">
      <div>📧 ${d.email}</div><div>📱 ${d.phone}</div><div>📍 ${d.location}</div><div>🆔 ID: ${d.cognizantId}</div>
    </div>
  </div>
  <div class="section"><div class="section-title">Education</div>${edu}</div>
  <div class="section"><div class="section-title">Technical Skills</div><div class="skills-container">${skillBlocks}</div></div>
  <div class="section"><div class="section-title">Projects</div>${projectsHtml}</div>
  <div class="section"><div class="section-title">Achievements</div>${ach}</div>
  <div class="section"><div class="section-title">Volunteering</div>${vol}</div>
  <div class="section"><div class="section-title">Strengths</div><div class="strengths-wrap">${str}</div></div>
</body>
</html>`;
}

const templates = {
  classic: classicTemplate,
  modern: modernTemplate,
  executive: executiveTemplate,
};

export function buildResumeHtml(dossier, templateId = 'classic') {
  const d = getData(dossier);
  const fn = templates[templateId] || classicTemplate;
  return fn(d);
}
