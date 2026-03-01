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
  return {
    name: escapeHtml(p.name || ''),
    email: escapeHtml(p.email || ''),
    phone: escapeHtml(p.phone || ''),
    location: escapeHtml(p.location || ''),
    cognizantId: escapeHtml(p.cognizantId || ''),
    role: escapeHtml(p.role || ''),
    track: escapeHtml(p.track || ''),
    education: dossier.education || [],
    skillGroups: order.filter((c) => byCat[c]?.length).map((c) => ({ name: c, items: byCat[c] || [] })),
    capstone: dossier.capstoneProject || {},
    achievements: dossier.achievements || [],
    volunteering: dossier.volunteering || [],
    sportsArts: dossier.sportsArts || [],
    strengths: dossier.strengths || [],
  };
}

/* ─────────────────────────────────────────────────────────────────────────────
   CLASSIC – Vibrant Yellow-Green Modern Design
   • Two-column layout with photo section
   • Bright yellow-green (#C4E538) accent color
   • Left sidebar with education, skills, certifications
   • Right panel with profile, experience, achievements, references
   • Modern typography with clean spacing
───────────────────────────────────────────────────────────────────────────── */
function classicTemplate(d) {
  /* education entries */
  const edu = section(
    d.education,
    (e) => `
    <div class="edu-entry">
      <div class="edu-badge">${e.year ? escapeHtml(e.year) : ''}</div>
      <div class="edu-content">
        <div class="edu-degree">${escapeHtml(e.degree)}</div>
        <div class="edu-inst">${escapeHtml(e.institution)}${e.stream ? ` / ${escapeHtml(e.stream)}` : ''}</div>
      </div>
      ${e.percentage ? `<div class="edu-percent">${escapeHtml(e.percentage)}</div>` : ''}
    </div>`
  );

  /* skills entries */
  const skillEntries = section(
    d.skillGroups,
    (g) => `
    <div class="skill-entry">
      <div class="skill-icon">●</div>
      <div class="skill-text">
        <div class="skill-name">${escapeHtml(g.name)}</div>
        <div class="skill-bar">
          <div class="skill-fill"></div>
        </div>
      </div>
    </div>
    ${(g.items || []).slice(0, 3).map(item => `<div class="skill-item">${escapeHtml(item)}</div>`).join('')}`
  );

  /* achievements/experience */
  const ach = section(
    d.achievements,
    (a) => `
    <div class="achievement-entry">
      <div class="achievement-dot"></div>
      <div class="achievement-content">
        <div class="achievement-title">${escapeHtml(a.title)}</div>
        ${a.description ? `<div class="achievement-desc">${escapeHtml(a.description)}</div>` : ''}
        ${a.date ? `<div class="achievement-date">${escapeHtml(a.date)}</div>` : ''}
      </div>
    </div>`
  );

  /* experience/capstone */
  const cap = d.capstone;
  const capHtml = cap.title
    ? `<div class="experience-entry">
         <div class="exp-dot"></div>
         <div class="exp-content">
           <div class="exp-title">${escapeHtml(cap.title)}</div>
           ${cap.role ? `<div class="exp-role">${escapeHtml(cap.role)}</div>` : ''}
           ${cap.techStack?.length ? `<div class="exp-tech">${(cap.techStack || []).map(escapeHtml).join(', ')}</div>` : ''}
           ${(cap.responsibilities || []).length ? `<ul class="exp-list">${(cap.responsibilities || []).map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : ''}
         </div>
       </div>`
    : '';

  /* volunteering */
  const vol = section(
    d.volunteering,
    (v) => `
    <div class="volunteer-entry">
      <div class="vol-dot"></div>
      <div class="vol-content">
        <div class="vol-org">${escapeHtml(v.organization)}</div>
        <div class="vol-role">${escapeHtml(v.role)}</div>
        ${v.description ? `<div class="vol-desc">${escapeHtml(v.description)}</div>` : ''}
      </div>
    </div>`
  );

  /* strengths as pills */
  const str = section(
    d.strengths,
    (s) => `<span class="strength-pill">${escapeHtml(s.name)}</span>`
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${d.name} — Professional Resume</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-yellow: #C4E538;
      --dark-gray: #000000;
      --light-gray: #F5F5F5;
      --text-dark: #1A1A1A;
      --text-light: #666666;
      --accent-dark: #2D2D2D;
      --white: #FFFFFF;
      --border-color: #E0E0E0;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Poppins', sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: var(--text-dark);
      background: var(--white);
      max-width: 100%;
      margin: 0;
      padding: 0;
    }

    .container {
      display: flex;
      min-height: 100vh;
      background: var(--white);
    }

    /* ─── LEFT SIDEBAR ─── */
    .sidebar {
      width: 35%;
      background: var(--light-gray);
      padding: 40px 30px;
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .photo-section {
      position: relative;
      margin-bottom: 20px;
    }

    .photo-placeholder {
      width: 100%;
      aspect-ratio: 1;
      background: var(--primary-yellow);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-dark);
      font-size: 12pt;
      font-weight: 600;
      overflow: hidden;
    }

    .photo-placeholder img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* ─── SECTION TITLES ─── */
    .sidebar-section {
      margin-top: 0;
    }

    .section-title {
      font-family: 'Playfair Display', serif;
      font-size: 20pt;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 15px;
      position: relative;
      padding-left: 15px;
    }

    .section-title::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 20px;
      background: var(--primary-yellow);
      border-radius: 2px;
    }

    /* ─── EDUCATION ─── */
    .edu-entry {
      background: var(--white);
      padding: 15px;
      border-radius: 10px;
      border-left: 4px solid var(--primary-yellow);
      margin-bottom: 12px;
      display: flex;
      gap: 12px;
    }

    .edu-badge {
      background: var(--primary-yellow);
      color: var(--text-dark);
      font-size: 9pt;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 20px;
      white-space: nowrap;
      flex-shrink: 0;
      height: fit-content;
    }

    .edu-content {
      flex: 1;
    }

    .edu-degree {
      font-size: 11pt;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 2px;
    }

    .edu-inst {
      font-size: 9pt;
      color: var(--text-light);
    }

    .edu-percent {
      font-size: 9pt;
      color: var(--primary-yellow);
      font-weight: 700;
    }

    /* ─── SKILLS ─── */
    .skill-entry {
      margin-bottom: 15px;
      display: flex;
      gap: 12px;
      align-items: center;
    }

    .skill-icon {
      color: var(--primary-yellow);
      font-size: 20pt;
      line-height: 1;
      flex-shrink: 0;
    }

    .skill-text {
      flex: 1;
    }

    .skill-name {
      font-size: 10pt;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 6px;
    }

    .skill-bar {
      height: 6px;
      background: var(--border-color);
      border-radius: 3px;
      overflow: hidden;
    }

    .skill-fill {
      height: 100%;
      background: var(--primary-yellow);
      width: 85%;
      border-radius: 3px;
    }

    .skill-item {
      font-size: 9pt;
      color: var(--text-light);
      margin-left: 20px;
      margin-bottom: 3px;
    }

    /* ─── RIGHT CONTENT ─── */
    .content {
      width: 65%;
      padding: 40px 40px;
      display: flex;
      flex-direction: column;
      gap: 30px;
      background: var(--white);
    }

    /* ─── HEADER ─── */
    .header {
      margin-bottom: 10px;
    }

    .name {
      font-family: 'Playfair Display', serif;
      font-size: 36pt;
      font-weight: 800;
      color: var(--text-dark);
      line-height: 1.1;
      margin-bottom: 5px;
    }

    .name .highlight {
      color: var(--primary-yellow);
    }

    .title-badge {
      display: inline-block;
      background: var(--primary-yellow);
      color: var(--text-dark);
      font-size: 11pt;
      font-weight: 700;
      padding: 8px 20px;
      border-radius: 25px;
      margin-bottom: 15px;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 9.5pt;
      color: var(--text-light);
    }

    .contact-item {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .contact-icon {
      color: var(--primary-yellow);
      font-size: 10pt;
    }

    /* ─── SECTIONS ─── */
    .content-section {
      margin-bottom: 25px;
    }

    .content-title {
      font-family: 'Playfair Display', serif;
      font-size: 18pt;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 15px;
      position: relative;
      padding-left: 15px;
    }

    .content-title::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 18px;
      background: var(--primary-yellow);
      border-radius: 2px;
    }

    .profile-text {
      font-size: 10pt;
      color: var(--text-light);
      line-height: 1.8;
      background: var(--light-gray);
      padding: 15px;
      border-radius: 10px;
    }

    /* ─── TIMELINE ENTRIES ─── */
    .timeline {
      position: relative;
      padding-left: 30px;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 2px;
      background: var(--primary-yellow);
    }

    .achievement-entry,
    .experience-entry,
    .volunteer-entry {
      position: relative;
      margin-bottom: 20px;
      padding-bottom: 20px;
    }

    .achievement-dot,
    .exp-dot,
    .vol-dot {
      position: absolute;
      left: -18px;
      top: 5px;
      width: 12px;
      height: 12px;
      background: var(--primary-yellow);
      border: 3px solid var(--white);
      border-radius: 50%;
      box-shadow: 0 0 0 2px var(--primary-yellow);
    }

    .achievement-content,
    .exp-content,
    .vol-content {
      padding-left: 0;
    }

    .achievement-title,
    .exp-title,
    .vol-org {
      font-size: 11pt;
      font-weight: 700;
      color: var(--text-dark);
      margin-bottom: 3px;
    }

    .achievement-desc,
    .exp-role,
    .vol-role {
      font-size: 10pt;
      color: var(--text-light);
      margin-bottom: 5px;
    }

    .achievement-date {
      font-size: 9pt;
      color: var(--primary-yellow);
      font-weight: 600;
    }

    .exp-tech,
    .vol-desc {
      font-size: 9.5pt;
      color: var(--text-light);
      margin-bottom: 5px;
    }

    .exp-list {
      list-style: none;
      padding: 0;
      margin: 8px 0 0 0;
    }

    .exp-list li {
      font-size: 9.5pt;
      color: var(--text-light);
      margin-bottom: 3px;
      padding-left: 12px;
      position: relative;
    }

    .exp-list li::before {
      content: '●';
      position: absolute;
      left: 0;
      color: var(--primary-yellow);
    }

    /* ─── STRENGTHS ─── */
    .strengths-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .strength-pill {
      display: inline-block;
      background: var(--light-gray);
      color: var(--text-dark);
      font-size: 9.5pt;
      font-weight: 600;
      padding: 8px 14px;
      border-radius: 20px;
      border: 1px solid var(--border-color);
    }

    .empty {
      color: var(--text-light);
      font-style: italic;
    }

    @media print {
      body { margin: 0; padding: 0; }
      .container { min-height: auto; }
      .sidebar, .content { padding: 30px; }
    }
  </style>
</head>
<body>

  <div class="container">
    
    <!-- LEFT SIDEBAR -->
    <div class="sidebar">
      
      <!-- Photo -->
      <div class="photo-section">
        <div class="photo-placeholder">PHOTO</div>
      </div>

      <!-- Education -->
      <div class="sidebar-section">
        <div class="section-title">Education</div>
        ${edu || '<p class="empty">—</p>'}
      </div>

      <!-- Skills -->
      <div class="sidebar-section">
        <div class="section-title">Skills</div>
        ${skillEntries || '<p class="empty">—</p>'}
      </div>

    </div>

    <!-- RIGHT CONTENT -->
    <div class="content">
      
      <!-- Header -->
      <div class="header">
        <div class="name">${d.name.split(' ').slice(0, -1).join(' ')} <span class="highlight">${d.name.split(' ').slice(-1)[0]}</span></div>
        <div class="title-badge">↳ ${d.role}</div>
        <div class="contact-info">
          <div class="contact-item">
            <span class="contact-icon">●</span>
            <span>${d.phone}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">✉</span>
            <span>${d.email}</span>
          </div>
          <div class="contact-item">
            <span class="contact-icon">📍</span>
            <span>${d.location}</span>
          </div>
        </div>
      </div>

      <!-- Profile -->
      <div class="content-section">
        <div class="content-title">Profile</div>
        <div class="profile-text">Professional with expertise in ${d.role}${d.track ? ' and ' + d.track : ''}. Dedicated to delivering high-quality results and continuous improvement. Strong background in strategic planning and execution.</div>
      </div>

      <!-- Experience/Capstone -->
      ${cap.title ? `<div class="content-section">
        <div class="content-title">Experience</div>
        <div class="timeline">
          ${capHtml}
        </div>
      </div>` : ''}

      <!-- Achievements -->
      ${ach ? `<div class="content-section">
        <div class="content-title">Achievements</div>
        <div class="timeline">
          ${ach}
        </div>
      </div>` : ''}

      <!-- Volunteering -->
      ${vol ? `<div class="content-section">
        <div class="content-title">Volunteering</div>
        <div class="timeline">
          ${vol}
        </div>
      </div>` : ''}

      <!-- Sports & Arts -->
      ${d.sportsArts && d.sportsArts.length > 0 ? `<div class="content-section">
        <div class="content-title">Achievements</div>
        <div class="strengths-wrap">
          ${section(d.sportsArts, (s) => `<span class="strength-pill">${escapeHtml(s.name)}</span>`)}
        </div>
      </div>` : ''}

      <!-- Strengths -->
      ${str ? `<div class="content-section">
        <div class="content-title">Core Strengths</div>
        <div class="strengths-wrap">
          ${str}
        </div>
      </div>` : ''}

    </div>

  </div>

</body>
</html>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODERN – navy header with photo circle, left sidebar, right main panel
   (UNCHANGED - ORIGINAL)
───────────────────────────────────────────────────────────────────────────── */
function modernTemplate(d) {
  /* sidebar – education */
  const edu = section(
    d.education,
    (e) => `
    <div class="edu-item">
      <div class="edu-degree">${escapeHtml(e.degree)}</div>
      <div class="edu-inst">${escapeHtml(e.institution)}</div>
      ${e.year || e.percentage
        ? `<div class="edu-meta">${e.year ? escapeHtml(e.year) : ''}${e.percentage ? ` · ${escapeHtml(e.percentage)}` : ''}</div>`
        : ''}
    </div>`
  );

  /* sidebar – skills */
  const skillRows = section(
    d.skillGroups,
    (g) => `
    <div class="skill-group">
      <div class="skill-cat">${escapeHtml(g.name)}</div>
      <div class="skill-items">${(g.items || []).map(escapeHtml).join(', ')}</div>
    </div>`
  );

  /* sidebar – strengths */
  const str = section(d.strengths, (s) => `<li>${escapeHtml(s.name)}</li>`);

  /* sidebar – sports & arts */
  const sports = section(
    d.sportsArts,
    (s) => `
    <div class="sport-item">
      <div class="sport-name">${escapeHtml(s.name)}</div>
      ${s.achievement ? `<div class="sport-sub">${escapeHtml(s.achievement)}</div>` : ''}
      ${s.level ? `<div class="sport-sub">${escapeHtml(s.level)}</div>` : ''}
    </div>`
  );

  /* main – capstone */
  const cap = d.capstone;
  const capHtml = cap.title
    ? `<div class="cap-title">${escapeHtml(cap.title)}</div>
       ${cap.role ? `<div class="cap-meta">Role: ${escapeHtml(cap.role)}</div>` : ''}
       ${cap.techStack?.length ? `<div class="cap-meta">Stack: ${(cap.techStack || []).map(escapeHtml).join(', ')}</div>` : ''}
       ${(cap.responsibilities || []).length
         ? `<ul class="cap-list">${(cap.responsibilities || []).map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`
         : ''}
       ${(cap.outcomes || []).length
         ? `<ul class="cap-list">${(cap.outcomes || []).map((o) => `<li>Outcomes: ${escapeHtml(o)}</li>`).join('')}</ul>`
         : ''}`
    : '<p class="empty">—</p>';

  /* main – achievements */
  const ach = section(
    d.achievements,
    (a) => `
    <div class="ach-row">
      <span class="ach-title">${escapeHtml(a.title)}</span>
      ${a.date ? `<span class="ach-date">${escapeHtml(a.date)}</span>` : ''}
    </div>`
  );

  /* main – volunteering */
  const vol = section(
    d.volunteering,
    (v) => `
    <div class="vol-block">
      <div class="vol-header">
        <span class="vol-org">${escapeHtml(v.organization)}</span>
        <span class="vol-role">${escapeHtml(v.role)}</span>
      </div>
      ${v.description ? `<div class="vol-desc">${escapeHtml(v.description)}</div>` : ''}
    </div>`
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Dossier — ${d.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --navy:     #1b3a5c;
      --navy-dk:  #162e4a;
      --navy-lt:  #2c5282;
      --accent:   #2a7abf;
      --accent2:  #3b8fd1;
      --muted:    #64748b;
      --line:     #d4dde8;
      --bg:       #f5f7fa;
      --white:    #ffffff;
      --text:     #1e2d3d;
      --sb-w:     260px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Source Sans 3', 'Segoe UI', sans-serif;
      font-size: 12.65px;
      line-height: 1.5;
      color: var(--text);
      background: var(--bg);
      max-width: 900px;
      margin: 0 auto;
    }

    /* ── HEADER ── */
    .header {
      background: var(--navy-dk);
      display: flex;
      align-items: center;
      gap: 22px;
      padding: 20px 28px 20px 24px;
    }
    .photo-wrap {
      flex-shrink: 0;
      width: 84px; height: 84px;
      border-radius: 50%;
      border: 3px solid rgba(255,255,255,0.3);
      background: var(--navy-lt);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      position: relative;
    }
    .photo-wrap svg { opacity: 0.55; }
    .photo-label {
      font-size: 8.05px;
      color: rgba(255,255,255,0.65);
      letter-spacing: 0.4px;
      margin-top: 2px;
    }
    .header-info { flex: 1; }
    .header-name {
      font-family: 'Lora', Georgia, serif;
      font-size: 31.05px;
      font-weight: 700;
      color: #fff;
      line-height: 1.1;
    }
    .header-role {
      font-size: 12.65px;
      color: #a8c4e0;
      margin-top: 5px;
    }
    .header-role strong { color: #c8ddf0; font-weight: 600; }
    .header-contact {
      display: flex;
      flex-wrap: wrap;
      gap: 0;
      margin-top: 9px;
      font-size: 11.5px;
      color: #b8cfe6;
    }
    .header-contact span {
      padding-right: 10px;
      margin-right: 10px;
      border-right: 1px solid rgba(255,255,255,0.2);
    }
    .header-contact span:last-child { border-right: none; }

    /* ── BODY WRAPPER ── */
    .body {
      display: flex;
      align-items: stretch;
      background: var(--white);
      border-top: 3px solid var(--accent2);
    }

    /* ── SIDEBAR ── */
    .sidebar {
      width: var(--sb-w);
      flex-shrink: 0;
      background: var(--white);
      border-right: 1px solid var(--line);
      padding: 16px 16px 24px;
    }
    .sb-section { margin-bottom: 18px; }
    .sb-title {
      font-size: 9.77px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.3px;
      color: var(--accent);
      margin-bottom: 9px;
    }
    /* education */
    .edu-item { margin-bottom: 11px; }
    .edu-degree { font-weight: 700; font-size: 12.65px; color: var(--text); }
    .edu-inst { font-size: 11.5px; color: var(--muted); margin-top: 1px; }
    .edu-meta { font-size: 11.5px; color: var(--accent); margin-top: 2px; font-weight: 600; }
    /* skills */
    .skill-group { margin-bottom: 9px; }
    .skill-cat { font-weight: 700; font-size: 12.07px; color: var(--text); }
    .skill-items { font-size: 11.5px; color: var(--muted); margin-top: 1px; line-height: 1.4; }
    /* strengths */
    .sb-list { list-style: none; padding: 0; }
    .sb-list li {
      font-size: 12.07px;
      padding: 2px 0 2px 14px;
      position: relative;
      color: var(--text);
    }
    .sb-list li::before {
      content: '';
      width: 5px; height: 5px;
      border-radius: 50%;
      background: var(--accent);
      position: absolute; left: 0; top: 6px;
    }
    /* sports */
    .sport-item { margin-bottom: 9px; }
    .sport-name { font-weight: 700; font-size: 12.65px; color: var(--text); }
    .sport-sub { font-size: 11.5px; color: var(--muted); margin-top: 1px; }

    /* ── MAIN PANEL ── */
    .main { flex: 1; padding: 16px 22px 24px; }
    .main-section { margin-bottom: 18px; }
    .main-title {
      font-size: 10.35px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.3px;
      color: var(--text);
      border-bottom: 1.5px solid var(--accent2);
      padding-bottom: 4px;
      margin-bottom: 10px;
    }
    /* capstone */
    .cap-title {
      font-family: 'Lora', serif;
      font-size: 15.52px;
      font-weight: 700;
      color: var(--text);
      margin-bottom: 4px;
    }
    .cap-meta { font-size: 12.07px; color: var(--muted); margin-bottom: 2px; }
    .cap-list {
      margin: 6px 0 0;
      padding-left: 16px;
      font-size: 12.07px;
      color: var(--text);
    }
    .cap-list li { margin-bottom: 3px; }
    /* achievements */
    .ach-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      padding: 5px 0;
      border-bottom: 1px solid var(--line);
      font-size: 12.07px;
    }
    .ach-row:last-child { border-bottom: none; }
    .ach-title { color: var(--text); font-weight: 500; }
    .ach-date {
      color: var(--accent);
      font-size: 11.5px;
      white-space: nowrap;
      margin-left: 8px;
      font-weight: 600;
      flex-shrink: 0;
    }
    /* volunteering */
    .vol-block { margin-bottom: 11px; }
    .vol-header { display: flex; justify-content: space-between; align-items: baseline; }
    .vol-org { font-weight: 700; font-size: 12.65px; color: var(--text); }
    .vol-role { font-size: 11.5px; color: var(--accent); font-weight: 600; }
    .vol-desc { font-size: 11.5px; color: var(--muted); margin-top: 2px; }

    .empty { color: var(--muted); font-style: italic; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="photo-wrap">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <circle cx="22" cy="15" r="9" fill="white"/>
        <ellipse cx="22" cy="40" rx="17" ry="10" fill="white"/>
      </svg>
      <span class="photo-label">YOUR PHOTO</span>
    </div>
    <div class="header-info">
      <div class="header-name">${d.name}</div>
      <div class="header-role">
        <strong>${d.role}</strong>${d.track ? ` &nbsp;·&nbsp; ${d.track}` : ''}
      </div>
      <div class="header-contact">
        <span>${d.email}</span>
        <span>${d.phone}</span>
        <span>${d.location}</span>
        <span>ID: ${d.cognizantId}</span>
      </div>
    </div>
  </div>

  <!-- BODY -->
  <div class="body">

    <!-- SIDEBAR -->
    <div class="sidebar">
      <div class="sb-section">
        <div class="sb-title">Education</div>
        ${edu || '<p class="empty">—</p>'}
      </div>
      <div class="sb-section">
        <div class="sb-title">Technical Skills</div>
        ${skillRows || '<p class="empty">—</p>'}
      </div>
      <div class="sb-section">
        <div class="sb-title">Strengths</div>
        <ul class="sb-list">${str || '<li>—</li>'}</ul>
      </div>
      <div class="sb-section">
        <div class="sb-title">Sports &amp; Arts</div>
        ${sports || '<p class="empty">—</p>'}
      </div>
    </div>

    <!-- MAIN -->
    <div class="main">
      <div class="main-section">
        <div class="main-title">Capstone Project</div>
        ${capHtml}
      </div>
      <div class="main-section">
        <div class="main-title">Achievements &amp; Awards</div>
        ${ach || '<p class="empty">—</p>'}
      </div>
      <div class="main-section">
        <div class="main-title">Volunteering</div>
        ${vol || '<p class="empty">—</p>'}
      </div>
    </div>

  </div>
</body>
</html>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   EXECUTIVE – Clean Professional Resume Design
   (UNCHANGED - ORIGINAL)
───────────────────────────────────────────────────────────────────────────── */
function executiveTemplate(d) {
  /* education */
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

  /* skills */
  const skillBlocks = section(
    d.skillGroups,
    (g) => `
    <div class="skill-item">
      <div class="skill-cat">${escapeHtml(g.name)}</div>
      <div class="skill-list">${(g.items || []).map(escapeHtml).join(', ')}</div>
    </div>`
  );

  /* capstone */
  const cap = d.capstone;
  const capHtml = cap.title
    ? `<div class="project-block">
         <div class="project-header">
           <div class="project-title">${escapeHtml(cap.title)}</div>
           ${cap.role ? `<div class="project-role">${escapeHtml(cap.role)}</div>` : ''}
         </div>
         ${cap.techStack?.length ? `<div class="project-tech"><strong>Tech Stack:</strong> ${(cap.techStack || []).map(escapeHtml).join(', ')}</div>` : ''}
         ${(cap.responsibilities || []).length ? `<ul class="project-list">${(cap.responsibilities || []).map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : ''}
         ${(cap.outcomes || []).length ? `<div class="project-outcomes"><strong>Key Outcomes:</strong> ${(cap.outcomes || []).map(escapeHtml).join(', ')}</div>` : ''}
       </div>`
    : '<p class="empty">—</p>';

  /* achievements */
  const ach = section(
    d.achievements,
    (a) => `
    <div class="item-row">
      <div class="item-title">${escapeHtml(a.title)}</div>
      ${a.date ? `<div class="item-date">${escapeHtml(a.date)}</div>` : ''}
      ${a.description ? `<div class="item-desc">${escapeHtml(a.description)}</div>` : ''}
    </div>`
  );

  /* volunteering */
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

  /* sports */
  const sports = section(
    d.sportsArts,
    (s) => `
    <div class="item-row">
      <div class="item-title">${escapeHtml(s.name)}</div>
      ${s.level ? `<div class="item-level">${escapeHtml(s.level)}</div>` : ''}
      ${s.achievement ? `<div class="item-desc">${escapeHtml(s.achievement)}</div>` : ''}
    </div>`
  );

  /* strengths */
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
      --primary:   #1a365d;
      --secondary: #2d3748;
      --accent:    #2563eb;
      --accent-light: #dbeafe;
      --gray-50:   #f9fafb;
      --gray-100:  #f3f4f6;
      --gray-300:  #d1d5db;
      --gray-500:  #6b7280;
      --gray-700:  #374151;
      --gray-900:  #111827;
      --white:     #ffffff;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 10.5pt;
      line-height: 1.5;
      color: var(--gray-900);
      background: var(--white);
      max-width: 8.5in;
      height: 11in;
      margin: 0 auto;
      padding: 0.5in;
    }

    /* ─── HEADER ─── */
    .header {
      border-bottom: 2px solid var(--primary);
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    
    .header-name {
      font-family: 'Merriweather', Georgia, serif;
      font-size: 24pt;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 2px;
      letter-spacing: -0.5px;
    }
    
    .header-title {
      font-size: 11pt;
      font-weight: 600;
      color: var(--accent);
      margin-bottom: 6px;
      letter-spacing: 0.3px;
    }
    
    .header-contact {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 9pt;
      color: var(--gray-700);
    }
    
    .header-contact-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* ─── SECTION ─── */
    .section {
      margin-bottom: 14px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 11pt;
      font-weight: 700;
      color: var(--primary);
      border-bottom: 1px solid var(--gray-300);
      padding-bottom: 4px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ─── EDUCATION ─── */
    .edu-item {
      margin-bottom: 10px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--gray-100);
    }
    
    .edu-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    
    .edu-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2px;
    }
    
    .edu-degree {
      font-weight: 600;
      font-size: 10.5pt;
      color: var(--gray-900);
    }
    
    .edu-date {
      font-size: 9pt;
      color: var(--gray-500);
      flex-shrink: 0;
      margin-left: 8px;
    }
    
    .edu-detail {
      font-size: 10pt;
      color: var(--gray-700);
      margin-top: 1px;
    }
    
    .edu-gpa {
      font-size: 9pt;
      color: var(--accent);
      font-weight: 500;
      margin-top: 2px;
    }

    /* ─── SKILLS ─── */
    .skills-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    .skill-item {
      margin-bottom: 8px;
    }
    
    .skill-cat {
      font-weight: 600;
      font-size: 9.5pt;
      color: var(--gray-900);
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 3px;
    }
    
    .skill-list {
      font-size: 10pt;
      color: var(--gray-700);
      line-height: 1.4;
    }

    /* ─── PROJECT/CAPSTONE ─── */
    .project-block {
      background: var(--gray-50);
      border-left: 3px solid var(--accent);
      padding: 10px 12px;
      margin-bottom: 10px;
      page-break-inside: avoid;
    }
    
    .project-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 6px;
    }
    
    .project-title {
      font-weight: 700;
      font-size: 10.5pt;
      color: var(--primary);
    }
    
    .project-role {
      font-size: 9pt;
      color: var(--accent);
      font-weight: 600;
      flex-shrink: 0;
      margin-left: 8px;
    }
    
    .project-tech {
      font-size: 9pt;
      color: var(--gray-700);
      margin-bottom: 4px;
    }
    
    .project-tech strong {
      color: var(--gray-900);
      font-weight: 600;
    }
    
    .project-list {
      margin: 4px 0 0 14px;
      padding: 0;
      font-size: 9.5pt;
      color: var(--gray-700);
    }
    
    .project-list li {
      margin-bottom: 2px;
    }
    
    .project-outcomes {
      font-size: 9pt;
      color: var(--gray-700);
      margin-top: 4px;
    }
    
    .project-outcomes strong {
      color: var(--gray-900);
      font-weight: 600;
    }

    /* ─── ITEMS (achievements, sports) ─── */
    .item-row {
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid var(--gray-100);
    }
    
    .item-row:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    
    .item-title {
      font-weight: 600;
      font-size: 10pt;
      color: var(--gray-900);
      margin-bottom: 1px;
    }
    
    .item-date {
      font-size: 9pt;
      color: var(--accent);
      font-weight: 500;
    }
    
    .item-level {
      font-size: 9pt;
      color: var(--accent);
      font-weight: 500;
    }
    
    .item-desc {
      font-size: 9.5pt;
      color: var(--gray-700);
      margin-top: 1px;
    }

    /* ─── VOLUNTEERING ─── */
    .vol-item {
      margin-bottom: 9px;
      padding-bottom: 7px;
      border-bottom: 1px solid var(--gray-100);
    }
    
    .vol-item:last-child {
      border-bottom: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    
    .vol-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2px;
    }
    
    .vol-org {
      font-weight: 600;
      font-size: 10pt;
      color: var(--gray-900);
    }
    
    .vol-role {
      font-size: 9pt;
      color: var(--accent);
      font-weight: 600;
      flex-shrink: 0;
      margin-left: 8px;
    }
    
    .vol-desc {
      font-size: 9.5pt;
      color: var(--gray-700);
      margin-top: 2px;
    }

    /* ─── STRENGTHS ─── */
    .strengths-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    
    .strength-tag {
      display: inline-block;
      background: var(--accent-light);
      color: var(--primary);
      font-size: 9pt;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 4px;
      white-space: nowrap;
    }

    .empty {
      color: var(--gray-500);
      font-style: italic;
      font-size: 10pt;
    }

    @media print {
      body { max-width: 100%; margin: 0; padding: 0.5in; }
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="header-name">${d.name}</div>
    <div class="header-title">${d.role}${d.track ? ' • ' + d.track : ''}</div>
    <div class="header-contact">
      <div class="header-contact-item">✉ ${d.email}</div>
      <div class="header-contact-item">✆ ${d.phone}</div>
      <div class="header-contact-item">📍 ${d.location}</div>
      <div class="header-contact-item">ID: ${d.cognizantId}</div>
    </div>
  </div>

  <!-- EDUCATION -->
  <div class="section">
    <div class="section-title">Education</div>
    ${edu || '<p class="empty">—</p>'}
  </div>

  <!-- TECHNICAL SKILLS -->
  <div class="section">
    <div class="section-title">Technical Skills</div>
    <div class="skills-container">${skillBlocks || '<p class="empty">—</p>'}</div>
  </div>

  <!-- CAPSTONE PROJECT -->
  <div class="section">
    <div class="section-title">Capstone Project</div>
    ${capHtml}
  </div>

  <!-- ACHIEVEMENTS -->
  <div class="section">
    <div class="section-title">Achievements &amp; Awards</div>
    ${ach || '<p class="empty">—</p>'}
  </div>

  <!-- VOLUNTEERING -->
  <div class="section">
    <div class="section-title">Volunteering</div>
    ${vol || '<p class="empty">—</p>'}
  </div>

  <!-- SPORTS & ARTS -->
  <div class="section">
    <div class="section-title">Sports, Arts &amp; Accomplishments</div>
    ${sports || '<p class="empty">—</p>'}
  </div>

  <!-- STRENGTHS -->
  <div class="section">
    <div class="section-title">Strengths</div>
    <div class="strengths-wrap">${str || '<p class="empty">—</p>'}</div>
  </div>

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