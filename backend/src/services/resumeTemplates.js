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
   CLASSIC – Slate & Emerald editorial design
   • White page, charcoal text, emerald accent
   • Left green border bar on section headings
   • Skill chips, two-column skill grid, clean ruled tables
   • Crisp header with name in large serif + teal underline rule
───────────────────────────────────────────────────────────────────────────── */
function classicTemplate(d) {
  /* education rows */
  const edu = section(
    d.education,
    (e) => `
    <div class="edu-row">
      <div class="edu-left">
        <div class="edu-degree">${escapeHtml(e.degree)}</div>
        <div class="edu-inst">${escapeHtml(e.institution)}${e.stream ? ` <span class="edu-stream">· ${escapeHtml(e.stream)}</span>` : ''}</div>
      </div>
      <div class="edu-right">
        ${e.year ? `<div class="edu-year">${escapeHtml(e.year)}</div>` : ''}
        ${e.percentage ? `<div class="edu-pct">${escapeHtml(e.percentage)}</div>` : ''}
      </div>
    </div>`
  );

  /* skill chips grouped */
  const skillBlocks = section(
    d.skillGroups,
    (g) => `
    <div class="skill-block">
      <div class="skill-label">${escapeHtml(g.name)}</div>
      <div class="skill-chips">${(g.items || []).map(escapeHtml).map((i) => `<span class="chip">${i}</span>`).join('')}</div>
    </div>`
  );

  /* capstone */
  const cap = d.capstone;
  const capHtml = cap.title
    ? `<div class="cap-name">${escapeHtml(cap.title)}</div>
       <div class="cap-sub-row">
         ${cap.role ? `<span class="cap-badge">Role: ${escapeHtml(cap.role)}</span>` : ''}
         ${cap.techStack?.length ? `<span class="cap-stack">${(cap.techStack || []).map(escapeHtml).map((t) => `<span class="chip chip-sm">${t}</span>`).join('')}</span>` : ''}
       </div>
       ${(cap.responsibilities || []).length ? `<ul class="cap-list">${(cap.responsibilities || []).map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : ''}
       ${(cap.outcomes || []).length ? `<div class="cap-outcomes">Outcomes: ${(cap.outcomes || []).map(escapeHtml).join(' · ')}</div>` : ''}`
    : '<p class="empty">—</p>';

  /* achievements */
  const ach = section(
    d.achievements,
    (a) => `
    <div class="list-row">
      <div class="list-main">
        <span class="list-title">${escapeHtml(a.title)}</span>
        ${a.description ? `<span class="list-desc"> — ${escapeHtml(a.description)}</span>` : ''}
      </div>
      ${a.date ? `<span class="list-date">${escapeHtml(a.date)}</span>` : ''}
    </div>`
  );

  /* volunteering */
  const vol = section(
    d.volunteering,
    (v) => `
    <div class="list-row">
      <div class="list-main">
        <span class="list-title">${escapeHtml(v.organization)}</span>
        <span class="list-desc"> — ${escapeHtml(v.role)}</span>
        ${v.description ? `<div class="list-sub">${escapeHtml(v.description)}</div>` : ''}
      </div>
    </div>`
  );

  /* sports */
  const sports = section(
    d.sportsArts,
    (s) => `
    <div class="list-row">
      <div class="list-main">
        <span class="list-title">${escapeHtml(s.name)}</span>
        ${s.achievement ? `<span class="list-desc"> — ${escapeHtml(s.achievement)}</span>` : ''}
      </div>
      ${s.level ? `<span class="chip chip-sm">${escapeHtml(s.level)}</span>` : ''}
    </div>`
  );

  /* strengths */
  const str = section(
    d.strengths,
    (s) => `<span class="strength-pill">${escapeHtml(s.name)}</span>`
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Dossier — ${d.name}</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --emerald:  #059669;
      --em-lt:    #d1fae5;
      --em-md:    #6ee7b7;
      --slate:    #1e293b;
      --slate-md: #334155;
      --muted:    #64748b;
      --line:     #e2e8f0;
      --bg:       #ffffff;
      --surface:  #f8fafc;
      --text:     #1e293b;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Nunito Sans', 'Segoe UI', sans-serif;
      font-size: 12.65px;
      line-height: 1.6;
      color: var(--text);
      background: var(--bg);
      max-width: 210mm;
      margin: 0 auto;
    }

    /* ── HEADER ── */
    .header {
      padding: 32px 36px 24px;
      border-bottom: 3px solid var(--emerald);
      background: var(--bg);
      position: relative;
    }
    .header::before {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 6px;
      height: 100%;
      background: var(--emerald);
    }
    .header-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 34px;
      font-weight: 800;
      color: var(--slate);
      line-height: 1.05;
      letter-spacing: -0.5px;
    }
    .header-role {
      margin-top: 6px;
      font-size: 13px;
      font-weight: 600;
      color: var(--emerald);
      letter-spacing: 0.3px;
    }
    .header-contact {
      display: flex;
      flex-wrap: wrap;
      gap: 4px 20px;
      margin-top: 10px;
      font-size: 11.5px;
      color: var(--muted);
    }
    .header-contact span { display: flex; align-items: center; gap: 5px; }
    .header-contact .ico { color: var(--emerald); font-size: 10px; }

    /* ── BODY ── */
    .body { padding: 24px 36px 32px 42px; }

    /* ── SECTION ── */
    .section { margin-bottom: 22px; }
    .sec-title {
      font-family: 'Nunito Sans', sans-serif;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.6px;
      color: var(--slate-md);
      padding-left: 10px;
      border-left: 3px solid var(--emerald);
      margin-bottom: 12px;
      line-height: 1.2;
    }

    /* ── EDUCATION ── */
    .edu-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 9px 0;
      border-bottom: 1px solid var(--line);
    }
    .edu-row:last-child { border-bottom: none; }
    .edu-degree { font-weight: 700; font-size: 13px; color: var(--slate); }
    .edu-inst { font-size: 12px; color: var(--muted); margin-top: 2px; }
    .edu-stream { font-size: 11px; }
    .edu-right { text-align: right; flex-shrink: 0; margin-left: 12px; }
    .edu-year { font-size: 12px; font-weight: 600; color: var(--slate-md); }
    .edu-pct { font-size: 11.5px; color: var(--emerald); font-weight: 700; margin-top: 2px; }

    /* ── SKILLS ── */
    .skills-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 20px; }
    .skill-block { }
    .skill-label {
      font-size: 10.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--muted);
      margin-bottom: 5px;
    }
    .skill-chips { display: flex; flex-wrap: wrap; gap: 4px; }
    .chip {
      display: inline-block;
      background: var(--surface);
      border: 1px solid var(--line);
      color: var(--slate-md);
      font-size: 11px;
      padding: 2px 9px;
      border-radius: 999px;
      font-weight: 600;
    }
    .chip-sm { font-size: 10px; padding: 1px 7px; }

    /* ── CAPSTONE ── */
    .cap-name {
      font-family: 'Playfair Display', serif;
      font-size: 16px;
      font-weight: 700;
      color: var(--slate);
      margin-bottom: 6px;
    }
    .cap-sub-row { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
    .cap-badge {
      font-size: 11px;
      font-weight: 600;
      color: var(--emerald);
      background: var(--em-lt);
      padding: 2px 9px;
      border-radius: 999px;
    }
    .cap-stack { display: flex; flex-wrap: wrap; gap: 4px; }
    .cap-list {
      padding-left: 18px;
      margin: 4px 0;
      font-size: 12.65px;
    }
    .cap-list li { margin-bottom: 4px; }
    .cap-outcomes {
      margin-top: 7px;
      font-size: 11.5px;
      color: var(--muted);
      font-style: italic;
    }

    /* ── GENERIC LIST ROWS ── */
    .list-row {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 7px 0;
      border-bottom: 1px dashed var(--line);
    }
    .list-row:last-child { border-bottom: none; }
    .list-main { flex: 1; }
    .list-title { font-weight: 700; font-size: 12.65px; color: var(--slate); }
    .list-desc { font-size: 12px; color: var(--muted); }
    .list-sub { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
    .list-date {
      flex-shrink: 0;
      margin-left: 12px;
      font-size: 11px;
      font-weight: 600;
      color: var(--emerald);
      white-space: nowrap;
    }

    /* ── STRENGTHS ── */
    .strengths-wrap { display: flex; flex-wrap: wrap; gap: 7px; }
    .strength-pill {
      display: inline-block;
      background: var(--em-lt);
      color: var(--emerald);
      font-size: 12px;
      font-weight: 700;
      padding: 4px 14px;
      border-radius: 999px;
      border: 1px solid var(--em-md);
    }

    .empty { color: var(--muted); font-style: italic; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="header-name">${d.name}</div>
    <div class="header-role">${d.role}${d.track ? ` · ${d.track}` : ''}</div>
    <div class="header-contact">
      <span><span class="ico">✉</span>${d.email}</span>
      <span><span class="ico">✆</span>${d.phone}</span>
      <span><span class="ico">⌖</span>${d.location}</span>
      <span><span class="ico">#</span>CTS ID: ${d.cognizantId}</span>
    </div>
  </div>

  <!-- BODY -->
  <div class="body">

    <!-- Education -->
    <div class="section">
      <div class="sec-title">Education</div>
      ${edu || '<p class="empty">—</p>'}
    </div>

    <!-- Technical Skills -->
    <div class="section">
      <div class="sec-title">Technical Skills</div>
      <div class="skills-grid">${skillBlocks || '<p class="empty">—</p>'}</div>
    </div>

    <!-- Capstone -->
    <div class="section">
      <div class="sec-title">Capstone Project</div>
      ${capHtml}
    </div>

    <!-- Achievements -->
    <div class="section">
      <div class="sec-title">Achievements &amp; Awards</div>
      ${ach || '<p class="empty">—</p>'}
    </div>

    <!-- Volunteering -->
    <div class="section">
      <div class="sec-title">Volunteering</div>
      ${vol || '<p class="empty">—</p>'}
    </div>

    <!-- Sports & Arts -->
    <div class="section">
      <div class="sec-title">Sports, Arts &amp; Accomplishments</div>
      ${sports || '<p class="empty">—</p>'}
    </div>

    <!-- Strengths -->
    <div class="section">
      <div class="sec-title">Strengths</div>
      <div class="strengths-wrap">${str || '<p class="empty">—</p>'}</div>
    </div>

  </div>
</body>
</html>`;
}

/* ─────────────────────────────────────────────────────────────────────────────
   MODERN – navy header with photo circle, left sidebar, right main panel
   Matches the reference screenshot layout exactly.
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
   EXECUTIVE – Charcoal & Gold formal design
   • Solid charcoal header band, gold accent line
   • Three-column info strip below header
   • Full-width dot-leader achievement rows
   • Subtle warm-cream surface tone, serif name + sans body
   • Skill category table with filled charcoal label cells
───────────────────────────────────────────────────────────────────────────── */
function executiveTemplate(d) {
  /* education */
  const edu = section(
    d.education,
    (e) => `
    <div class="edu-entry">
      <div class="edu-left">
        <div class="edu-degree">${escapeHtml(e.degree)}</div>
        <div class="edu-inst">${escapeHtml(e.institution)}${e.stream ? ` <span class="edu-stream">· ${escapeHtml(e.stream)}</span>` : ''}</div>
      </div>
      <div class="edu-right">
        ${e.year ? `<div class="edu-year">${escapeHtml(e.year)}</div>` : ''}
        ${e.percentage ? `<div class="edu-pct">${escapeHtml(e.percentage)}</div>` : ''}
      </div>
    </div>`
  );

  /* skills — category label cell filled charcoal */
  const skillRows = section(
    d.skillGroups,
    (g) => `
    <tr>
      <td class="sk-cat">${escapeHtml(g.name)}</td>
      <td class="sk-items">${(g.items || []).map(escapeHtml).map((i) => `<span class="sk-tag">${i}</span>`).join('')}</td>
    </tr>`
  );

  /* capstone */
  const cap = d.capstone;
  const capHtml = cap.title
    ? `<div class="cap-wrap">
         <div class="cap-head">
           <span class="cap-name">${escapeHtml(cap.title)}</span>
           ${cap.role ? `<span class="cap-role-badge">${escapeHtml(cap.role)}</span>` : ''}
         </div>
         ${cap.techStack?.length
           ? `<div class="cap-tech">
                <span class="cap-tech-label">Stack</span>
                ${(cap.techStack || []).map(escapeHtml).map((t) => `<span class="sk-tag sk-tag-sm">${t}</span>`).join('')}
              </div>`
           : ''}
         ${(cap.responsibilities || []).length
           ? `<ul class="cap-list">${(cap.responsibilities || []).map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`
           : ''}
         ${(cap.outcomes || []).length
           ? `<div class="cap-out"><span class="cap-out-label">Outcomes —</span> ${(cap.outcomes || []).map(escapeHtml).join(' · ')}</div>`
           : ''}
       </div>`
    : '<p class="empty">—</p>';

  /* achievements — dot leader row */
  const ach = section(
    d.achievements,
    (a) => `
    <div class="leader-row">
      <span class="leader-title">${escapeHtml(a.title)}${a.description ? ` <span class="leader-sub">— ${escapeHtml(a.description)}</span>` : ''}</span>
      <span class="leader-dots"></span>
      <span class="leader-date">${a.date ? escapeHtml(a.date) : ''}</span>
    </div>`
  );

  /* volunteering */
  const vol = section(
    d.volunteering,
    (v) => `
    <div class="vol-entry">
      <div class="vol-header">
        <span class="vol-org">${escapeHtml(v.organization)}</span>
        <span class="vol-role">${escapeHtml(v.role)}</span>
      </div>
      ${v.description ? `<div class="vol-desc">${escapeHtml(v.description)}</div>` : ''}
    </div>`
  );

  /* sports */
  const sports = section(
    d.sportsArts,
    (s) => `
    <div class="leader-row">
      <span class="leader-title">${escapeHtml(s.name)}${s.achievement ? ` <span class="leader-sub">— ${escapeHtml(s.achievement)}</span>` : ''}</span>
      <span class="leader-dots"></span>
      <span class="leader-date">${s.level ? escapeHtml(s.level) : ''}</span>
    </div>`
  );

  /* strengths — inline with gold dot separator */
  const str = d.strengths.length
    ? d.strengths.map((s) => `<span class="str-item">${escapeHtml(s.name)}</span>`).join('<span class="str-sep">◆</span>')
    : '—';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${d.name} — Executive Dossier</title>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Jost:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --charcoal:  #1c1c1e;
      --charcoal2: #2d2d2f;
      --gold:      #b8963e;
      --gold-lt:   #f5edd8;
      --gold-md:   #dfc07a;
      --cream:     #faf8f4;
      --muted:     #737373;
      --line:      #e5e0d8;
      --text:      #1c1c1e;
      --white:     #ffffff;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Jost', 'Segoe UI', sans-serif;
      font-size: 12.07px;
      line-height: 1.6;
      color: var(--text);
      background: var(--cream);
      max-width: 210mm;
      margin: 0 auto;
    }

    /* ── HEADER BAND ── */
    .header {
      background: var(--charcoal);
      padding: 28px 36px 22px;
    }
    .header-top { display: flex; justify-content: space-between; align-items: flex-end; }
    .header-name {
      font-family: 'Cormorant Garamond', Georgia, serif;
      font-size: 36px;
      font-weight: 700;
      color: var(--white);
      line-height: 1;
      letter-spacing: 0.5px;
    }
    .header-id {
      font-size: 11px;
      color: var(--gold-md);
      font-weight: 500;
      letter-spacing: 0.8px;
      text-align: right;
    }
    /* gold divider */
    .gold-rule { height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-md), transparent); margin: 12px 0 14px; }
    /* three-column strip */
    .header-strip {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 0;
    }
    .strip-cell {
      padding: 0 18px 0 0;
      border-right: 1px solid rgba(255,255,255,0.12);
    }
    .strip-cell:last-child { border-right: none; padding-left: 18px; padding-right: 0; }
    .strip-cell:nth-child(2) { padding-left: 18px; }
    .strip-label { font-size: 9px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; color: var(--gold); margin-bottom: 2px; }
    .strip-value { font-size: 11.5px; color: #d4cfc8; }

    /* ── BODY ── */
    .body { padding: 22px 36px 32px; background: var(--cream); }

    /* ── SECTION ── */
    .section { margin-bottom: 20px; }
    .sec-head {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 12px;
    }
    .sec-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: 17px;
      font-weight: 700;
      color: var(--charcoal);
      letter-spacing: 0.2px;
      line-height: 1;
    }
    .sec-rule { flex: 1; height: 1px; background: var(--line); }
    .sec-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--gold); flex-shrink: 0; }

    /* ── EDUCATION ── */
    .edu-entry {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 9px 0;
      border-bottom: 1px solid var(--line);
    }
    .edu-entry:last-child { border-bottom: none; }
    .edu-degree { font-weight: 600; font-size: 13px; color: var(--charcoal); }
    .edu-inst { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
    .edu-stream { font-size: 11px; }
    .edu-right { text-align: right; flex-shrink: 0; margin-left: 14px; }
    .edu-year { font-size: 12px; font-weight: 600; color: var(--charcoal2); }
    .edu-pct { font-size: 11.5px; color: var(--gold); font-weight: 700; margin-top: 2px; }

    /* ── SKILLS TABLE ── */
    .sk-table { width: 100%; border-collapse: collapse; }
    .sk-table tr { border-bottom: 1px solid var(--line); }
    .sk-table tr:last-child { border-bottom: none; }
    .sk-cat {
      background: var(--charcoal2);
      color: var(--gold-md);
      font-size: 9.5px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      padding: 7px 12px;
      white-space: nowrap;
      vertical-align: middle;
      width: 115px;
    }
    .sk-items { padding: 6px 0 6px 12px; vertical-align: middle; }
    .sk-tag {
      display: inline-block;
      background: var(--white);
      border: 1px solid var(--line);
      color: var(--charcoal2);
      font-size: 11px;
      padding: 2px 9px;
      border-radius: 3px;
      margin: 2px 3px 2px 0;
      font-weight: 500;
    }
    .sk-tag-sm { font-size: 10.5px; padding: 1px 7px; }

    /* ── CAPSTONE ── */
    .cap-wrap {
      background: var(--white);
      border: 1px solid var(--line);
      border-left: 4px solid var(--gold);
      border-radius: 3px;
      padding: 14px 16px;
    }
    .cap-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 7px; flex-wrap: wrap; }
    .cap-name {
      font-family: 'Cormorant Garamond', serif;
      font-size: 17px;
      font-weight: 700;
      color: var(--charcoal);
    }
    .cap-role-badge {
      font-size: 10.5px;
      font-weight: 600;
      color: var(--gold);
      background: var(--gold-lt);
      border: 1px solid var(--gold-md);
      border-radius: 3px;
      padding: 2px 8px;
    }
    .cap-tech { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; margin-bottom: 8px; }
    .cap-tech-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: var(--muted);
      margin-right: 4px;
    }
    .cap-list { padding-left: 18px; margin: 6px 0; font-size: 12.07px; color: var(--text); }
    .cap-list li { margin-bottom: 4px; }
    .cap-out { margin-top: 8px; font-size: 11.5px; color: var(--muted); font-style: italic; }
    .cap-out-label { font-style: normal; font-weight: 600; color: var(--charcoal2); }

    /* ── DOT-LEADER ROWS (achievements, sports) ── */
    .leader-row {
      display: flex;
      align-items: baseline;
      gap: 0;
      padding: 7px 0;
      border-bottom: 1px solid var(--line);
    }
    .leader-row:last-child { border-bottom: none; }
    .leader-title { font-size: 12.07px; font-weight: 600; color: var(--charcoal); white-space: nowrap; }
    .leader-sub { font-weight: 400; color: var(--muted); font-size: 11.5px; }
    .leader-dots {
      flex: 1;
      border-bottom: 1.5px dotted var(--line);
      margin: 0 8px;
      position: relative;
      top: -3px;
      min-width: 20px;
    }
    .leader-date { font-size: 11.5px; font-weight: 600; color: var(--gold); white-space: nowrap; }

    /* ── VOLUNTEERING ── */
    .vol-entry { padding: 8px 0; border-bottom: 1px solid var(--line); }
    .vol-entry:last-child { border-bottom: none; }
    .vol-header { display: flex; justify-content: space-between; align-items: baseline; }
    .vol-org { font-weight: 700; font-size: 12.65px; color: var(--charcoal); }
    .vol-role { font-size: 11.5px; font-weight: 600; color: var(--gold); }
    .vol-desc { font-size: 11.5px; color: var(--muted); margin-top: 3px; }

    /* ── STRENGTHS ── */
    .str-row { font-size: 12.65px; color: var(--charcoal); line-height: 2; }
    .str-item { font-weight: 600; }
    .str-sep { color: var(--gold); margin: 0 10px; font-size: 9px; vertical-align: middle; }

    .empty { color: var(--muted); font-style: italic; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="header-top">
      <div class="header-name">${d.name}</div>
      <div class="header-id">Cognizant ID: ${d.cognizantId}</div>
    </div>
    <div class="gold-rule"></div>
    <div class="header-strip">
      <div class="strip-cell">
        <div class="strip-label">Role</div>
        <div class="strip-value">${d.role}${d.track ? ` · ${d.track}` : ''}</div>
      </div>
      <div class="strip-cell">
        <div class="strip-label">Contact</div>
        <div class="strip-value">${d.email} · ${d.phone}</div>
      </div>
      <div class="strip-cell">
        <div class="strip-label">Location</div>
        <div class="strip-value">${d.location}</div>
      </div>
    </div>
  </div>

  <!-- BODY -->
  <div class="body">

    <!-- Education -->
    <div class="section">
      <div class="sec-head"><span class="sec-dot"></span><span class="sec-title">Education</span><span class="sec-rule"></span></div>
      ${edu || '<p class="empty">—</p>'}
    </div>

    <!-- Technical Skills -->
    <div class="section">
      <div class="sec-head"><span class="sec-dot"></span><span class="sec-title">Technical Skills</span><span class="sec-rule"></span></div>
      <table class="sk-table"><tbody>${skillRows || '<tr><td class="empty">—</td></tr>'}</tbody></table>
    </div>

    <!-- Capstone -->
    <div class="section">
      <div class="sec-head"><span class="sec-dot"></span><span class="sec-title">Capstone Project</span><span class="sec-rule"></span></div>
      ${capHtml}
    </div>

    <!-- Achievements -->
    <div class="section">
      <div class="sec-head"><span class="sec-dot"></span><span class="sec-title">Achievements &amp; Awards</span><span class="sec-rule"></span></div>
      ${ach || '<p class="empty">—</p>'}
    </div>

    <!-- Volunteering -->
    <div class="section">
      <div class="sec-head"><span class="sec-dot"></span><span class="sec-title">Volunteering</span><span class="sec-rule"></span></div>
      ${vol || '<p class="empty">—</p>'}
    </div>

    <!-- Sports & Arts -->
    <div class="section">
      <div class="sec-head"><span class="sec-dot"></span><span class="sec-title">Sports, Arts &amp; Accomplishments</span><span class="sec-rule"></span></div>
      ${sports || '<p class="empty">—</p>'}
    </div>

    <!-- Strengths -->
    <div class="section">
      <div class="sec-head"><span class="sec-dot"></span><span class="sec-title">Strengths</span><span class="sec-rule"></span></div>
      <div class="str-row">${str}</div>
    </div>

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