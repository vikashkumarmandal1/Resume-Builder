import { useEffect, useMemo, useRef, useState } from 'react';

const NAV = [
  { id: 'about', label: 'About' },
  { id: 'works', label: 'Works' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];

function clampList(items, max = 4) {
  return (items || []).filter(Boolean).slice(0, max);
}

function initials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return 'P';
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('');
}

export default function DeveloperDark({ dossier }) {
  const p = dossier?.profile || {};
  const edu = dossier?.education || [];
  const skills = dossier?.technicalSkills || [];
  const cap = dossier?.capstoneProject || {};
  const achievements = dossier?.achievements || [];
  const volunteering = dossier?.volunteering || [];
  const sportsArts = dossier?.sportsArts || [];
  const strengths = dossier?.strengths || [];

  const name = p.name || 'Portfolio';
  const roleLine = [p.role, p.track].filter(Boolean).join(' · ');

  const refs = {
    hero: useRef(null),
    about: useRef(null),
    works: useRef(null),
    gallery: useRef(null),
    contact: useRef(null),
  };

  const [cursor, setCursor] = useState({ x: -300, y: -300 });
  const [activeNav, setActiveNav] = useState('hero');

  const aboutText = useMemo(() => {
    const parts = [];
    if (name && (p.role || p.track)) {
      parts.push(`${name.split(' ')[0]} is a ${[p.role, p.track].filter(Boolean).join(' / ')}.`);
    } else if (name) {
      parts.push(`Hello, I’m ${name.split(' ')[0]}.`);
    }
    if (p.location) parts.push(`Based in ${p.location}.`);
    if (strengths.length > 0) parts.push(`Known for ${strengths.map((s) => s.name).filter(Boolean).slice(0, 3).join(', ')}.`);
    if (cap?.title) parts.push(`Recent work includes ${cap.title}.`);
    return parts.join(' ') || 'A focused portfolio showcasing experience, skills, and outcomes.';
  }, [cap?.title, name, p.location, p.role, p.track, strengths]);

  const works = useMemo(() => {
    const items = [];
    if (cap?.title) {
      items.push({
        year: 'Capstone',
        title: cap.title,
        desc:
          (cap.responsibilities || []).filter(Boolean)[0] ||
          (cap.outcomes || []).filter(Boolean)[0] ||
          cap.role ||
          'Featured project',
        hl: true,
      });
    }
    edu.forEach((e) => {
      items.push({
        year: e.year || 'Education',
        title: e.institution || e.degree || 'Education',
        desc: [e.degree, e.stream, e.percentage].filter(Boolean).join(' · '),
        hl: false,
      });
    });
    achievements.slice(0, 3).forEach((a) => {
      items.push({
        year: a.date || 'Achievement',
        title: a.title || 'Achievement',
        desc: a.description || '—',
        hl: false,
      });
    });
    return items.slice(0, 6);
  }, [achievements, cap?.outcomes, cap?.responsibilities, cap?.role, cap?.title, edu]);

  const galleryCards = useMemo(() => {
    const programming = (skills.find((s) => s.category === 'programming') || {}).items || [];
    const fullstack = (skills.find((s) => s.category === 'fullstack') || {}).items || [];
    const tools = (skills.find((s) => s.category === 'tools') || {}).items || [];
    const beyond = [...sportsArts.map((s) => s.name), ...strengths.map((s) => s.name)].filter(Boolean);

    return [
      { label: 'Core', items: clampList(programming, 5), emoji: '💻' },
      { label: 'Frameworks', items: clampList(fullstack, 5), emoji: '🧩' },
      { label: 'Tools', items: clampList(tools, 5), emoji: '🛠️' },
      { label: 'Beyond', items: clampList(beyond, 5), emoji: '🌿' },
    ].filter((c) => c.items.length > 0).slice(0, 3);
  }, [skills, sportsArts, strengths]);

  // cursor glow
  useEffect(() => {
    const fn = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', fn, { passive: true });
    return () => window.removeEventListener('mousemove', fn);
  }, []);

  // active nav highlight
  useEffect(() => {
    const els = Object.values(refs).map((r) => r.current).filter(Boolean);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveNav(e.target.id);
        });
      },
      { threshold: 0.35 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // fade in on scroll (toggle class)
  useEffect(() => {
    const els = document.querySelectorAll('.devdark-fade');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.target.classList.toggle('devdark-vis', e.isIntersecting)),
      { threshold: 0.08 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const go = (id) => refs[id]?.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-[#142014] text-[#e8f0d8] font-sans overflow-x-hidden">
      {/* local styles (scoped via classnames) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600&display=swap');
        .devdark-heroTitle { font-family: 'Bebas Neue', sans-serif; letter-spacing: -1px; line-height: 0.86; }
        .devdark-label { font-family: 'Bebas Neue', sans-serif; letter-spacing: -1px; line-height: 0.9; }
        .devdark-fade { opacity: 0; transform: translateY(28px); transition: opacity .7s ease, transform .7s ease; }
        .devdark-fade.devdark-vis { opacity: 1; transform: translateY(0); }
      `}</style>

      <div
        className="fixed w-[300px] h-[300px] rounded-full pointer-events-none z-[60]"
        style={{
          left: cursor.x,
          top: cursor.y,
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(200,245,60,0.06) 0%, transparent 70%)',
        }}
      />

      {/* HERO */}
      <section id="hero" ref={refs.hero} className="w-full bg-[#142014] px-6 pt-6">
        <div className="bg-[#c9f542] rounded-[26px] relative overflow-hidden min-h-[540px] h-[86vh] flex flex-col justify-between">
          {/* diagonal lines */}
          <div className="absolute inset-0 pointer-events-none">
            <svg viewBox="0 0 1200 750" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
              {Array.from({ length: 22 }, (_, i) => {
                const x = -400 + i * 100;
                const a = Math.max(0, 0.18 - i * 0.005);
                return (
                  <line
                    key={i}
                    x1={x}
                    y1="0"
                    x2={x + 850}
                    y2="750"
                    stroke={`rgba(130,200,5,${a})`}
                    strokeWidth="1.3"
                  />
                );
              })}
            </svg>
          </div>

          {/* ghost rows */}
          <div className="absolute inset-0 pt-16 pointer-events-none select-none flex flex-col justify-center gap-0">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="devdark-heroTitle text-[clamp(70px,15vw,205px)] text-[rgba(160,210,8,0.32)] px-8 whitespace-nowrap overflow-hidden"
              >
                {name.toUpperCase()}
              </div>
            ))}
          </div>

          {/* big title */}
          <div className="devdark-heroTitle text-[clamp(66px,13vw,176px)] text-[#0d1a0d] px-8 pt-7 relative z-[4]">
            {name.toUpperCase()}
          </div>

          {/* center "photo" replacement (clean + no external dependency) */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-[2] w-[min(520px,70vw)] flex items-end justify-center pointer-events-none select-none">
            <div className="w-full h-[92%] rounded-[260px_260px_0_0] bg-gradient-to-b from-[#2d3d1a] to-[#1a2510] flex items-center justify-center shadow-[0_30px_80px_rgba(0,0,0,0.25)]">
              {p.photoUrl ? (
                <img
                  src={p.photoUrl}
                  alt={name}
                  className="w-full h-full rounded-[260px_260px_0_0] object-cover"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-[rgba(13,26,13,0.9)] flex items-center justify-center text-[#c9f542] text-3xl font-semibold">
                  {initials(name)}
                </div>
              )}
            </div>
          </div>

          {/* bottom strip */}
          <div className="relative z-[5] grid grid-cols-1 md:grid-cols-2 items-end gap-5 px-8 pb-8">
            <div>
              <p className="text-[13.5px] text-[#0d1a0d] max-w-[240px] leading-[1.58] opacity-90 mb-4">
                {aboutText}
              </p>
              <div className="flex gap-2.5">
                {p.github && (
                  <a
                    className="w-9 h-9 bg-[#0d1a0d] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    href={p.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    title="GitHub"
                  >
                    <span className="text-[#c9f542] text-sm font-semibold">GH</span>
                  </a>
                )}
                {p.linkedIn && (
                  <a
                    className="w-9 h-9 bg-[#0d1a0d] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    href={p.linkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    title="LinkedIn"
                  >
                    <span className="text-[#c9f542] text-sm font-semibold">in</span>
                  </a>
                )}
                {p.email && (
                  <a
                    className="w-9 h-9 bg-[#0d1a0d] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    href={`mailto:${p.email}`}
                    aria-label="Email"
                    title="Email"
                  >
                    <span className="text-[#c9f542] text-sm font-semibold">@</span>
                  </a>
                )}
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-[#0d1a0d] max-w-[260px] leading-[1.6] opacity-90 ml-auto mb-4">
                {roleLine || 'Full-stack developer focused on clean, maintainable outcomes.'}
              </p>
              <button
                type="button"
                onClick={() => go('about')}
                className="w-10 h-10 bg-[#0d1a0d] rounded-full inline-flex items-center justify-center hover:translate-y-1 transition-transform"
                aria-label="Scroll"
                title="Scroll"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#c9f542]">
                  <path d="M12 16l-6-6h12z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NAV */}
      <nav className="bg-[#142014] sticky top-0 z-[50] backdrop-blur-md flex justify-center items-center gap-7 md:gap-20 px-6 py-5">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => go(n.id)}
            className={`relative text-sm font-medium tracking-wide px-1 py-1 transition-colors ${
              activeNav === n.id ? 'text-[#c8f53c]' : 'text-[rgba(232,240,216,0.55)]'
            } hover:text-[#c8f53c] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:rounded after:bg-[#c8f53c] after:transition-transform after:duration-300 ${
              activeNav === n.id ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            {n.label}
          </button>
        ))}
      </nav>

      {/* ABOUT */}
      <section id="about" ref={refs.about} className="bg-[#1c2e1c] px-7 md:px-16 py-16 md:py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div className="devdark-fade">
            <div className="devdark-label text-[clamp(60px,9vw,110px)] text-[#c8f53c] mb-6">about</div>
            <button
              type="button"
              onClick={() => go('works')}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(232,240,216,0.35)] px-4 py-2 text-sm hover:bg-[#c8f53c] hover:text-[#0d150d] hover:border-[#c8f53c] transition-all mb-6"
            >
              Learn More ↗
            </button>
            <p className="text-[13.5px] leading-[1.7] text-[rgba(232,240,216,0.55)] max-w-[380px]">
              {aboutText}
              {(p.location || p.phone) && (
                <span className="block mt-3">
                  {[p.location, p.phone].filter(Boolean).join(' · ')}
                </span>
              )}
            </p>
          </div>

          <div className="devdark-fade flex justify-center items-center pt-4">
            <div className="relative w-[300px] h-[300px] flex items-center justify-center">
              <svg className="absolute inset-0 animate-spin [animation-duration:18s]" viewBox="0 0 300 300">
                <defs>
                  <path id="devdark-ring" d="M150,150 m-120,0 a120,120 0 1,1 240,0 a120,120 0 1,1 -240,0" />
                </defs>
                <text fill="rgba(232,240,216,0.55)" fontSize="11.5" fontFamily="Inter" fontWeight="500" letterSpacing="7">
                  <textPath href="#devdark-ring">
                    TECH STACK · TECH STACK · TECH STACK · TECH STACK · TECH STACK ·
                  </textPath>
                </text>
              </svg>
              <div className="w-[190px] h-[190px] rounded-full bg-[radial-gradient(circle_at_40%_35%,#e0f060,#b0e020)] flex items-center justify-center shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_0_2px_rgba(255,255,255,0.08)]">
                <span className="text-[64px] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.5)]">🧑‍💻</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKS */}
      <section id="works" ref={refs.works} className="bg-[#142014] px-7 md:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="devdark-fade flex justify-between items-end mb-10">
            <button
              type="button"
              onClick={() => go('gallery')}
              className="inline-flex items-center gap-2 rounded-full border border-[rgba(232,240,216,0.3)] px-4 py-2 text-sm hover:bg-[#c8f53c] hover:text-[#0d150d] hover:border-[#c8f53c] transition-all whitespace-nowrap"
            >
              View All ↗
            </button>
            <div className="devdark-label text-[clamp(60px,9vw,110px)] text-[#c8f53c]">works</div>
          </div>

          <div className="devdark-fade flex justify-end mb-10">
            <p className="text-[12.5px] leading-[1.65] text-[rgba(232,240,216,0.55)] max-w-[340px] text-right">
              Highlights pulled from your capstone, education, and achievements — automatically updated from your inputs.
            </p>
          </div>

          <div className="devdark-fade">
            {(works.length > 0 ? works : [{ year: '—', title: 'Add your content', desc: 'Fill in capstone, education, and achievements in the builder.', hl: true }]).map(
              (w, i) => (
                <div
                  key={`${w.year}-${w.title}-${i}`}
                  className={`border-t border-white/10 last:border-b last:border-white/10 rounded-lg transition-colors overflow-hidden ${
                    w.hl ? 'bg-[#c8f53c] my-2 border-transparent rounded-2xl' : 'hover:bg-white/5'
                  }`}
                >
                  <div className={`grid gap-6 items-center px-4 md:px-6 py-6 ${w.hl ? 'md:grid-cols-[120px_1fr_auto]' : 'md:grid-cols-[90px_1fr_auto]'}`}>
                    <span className={`text-sm ${w.hl ? 'text-[#0d150d]' : 'text-[rgba(232,240,216,0.55)]'}`}>{w.year}</span>
                    <div>
                      <div className={`text-[15px] font-semibold mb-1 ${w.hl ? 'text-[#0d150d]' : 'text-[#e8f0d8]'}`}>{w.title}</div>
                      <div className={`text-[12.5px] leading-[1.55] max-w-[520px] ${w.hl ? 'text-[#0d150d]' : 'text-[rgba(232,240,216,0.55)]'}`}>{w.desc}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => go('contact')}
                      className={`hidden md:inline-flex items-center rounded-full px-5 py-2 text-[12.5px] transition-all ${
                        w.hl
                          ? 'bg-[#0d150d] text-[#c8f53c] border border-transparent'
                          : 'border border-[rgba(232,240,216,0.3)] text-[#e8f0d8] hover:bg-[#c8f53c] hover:text-[#0d150d] hover:border-[#c8f53c]'
                      }`}
                    >
                      Discover
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* GALLERY (skills) */}
      <section id="gallery" ref={refs.gallery} className="bg-[#1c2e1c] px-7 md:px-16 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="devdark-fade flex justify-between items-start gap-8 mb-10">
            <div className="devdark-label text-[clamp(60px,9vw,110px)] text-[#c8f53c]">gallery</div>
            <div className="flex flex-col items-end gap-3">
              <button
                type="button"
                onClick={() => go('contact')}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(232,240,216,0.3)] px-4 py-2 text-sm hover:bg-[#c8f53c] hover:text-[#0d150d] hover:border-[#c8f53c] transition-all whitespace-nowrap"
              >
                Contact ↗
              </button>
              <p className="text-[12.5px] leading-[1.65] text-[rgba(232,240,216,0.55)] max-w-[320px] text-right">
                A quick snapshot of your skills and focus areas.
              </p>
            </div>
          </div>

          <div className="devdark-fade grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(galleryCards.length > 0
              ? galleryCards
              : [{ label: 'Skills', items: ['Add skills in builder'], emoji: '✨' }]
            ).map((c) => (
              <div
                key={c.label}
                className="rounded-2xl overflow-hidden border border-white/10 bg-[#243824] p-5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.5)] transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[rgba(232,240,216,0.55)]">{c.label}</p>
                    <p className="mt-1 text-sm text-[#e8f0d8] font-semibold">Focus</p>
                  </div>
                  <div className="text-3xl">{c.emoji}</div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-[rgba(232,240,216,0.7)]">
                  {c.items.map((it) => (
                    <li key={it} className="flex gap-2 items-start">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#c8f53c] shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" ref={refs.contact} className="bg-[#c8f53c] px-7 md:px-16 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none">
          <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
            {[0, 50, 100, 150].map((o, i) => (
              <path
                key={i}
                d={`M-100 ${200 + o} Q300 ${100 + o} 600 ${200 + o} Q900 ${300 + o} 1300 ${200 + o}`}
                stroke={`rgba(80,160,0,${0.4 - i * 0.08})`}
                strokeWidth="1.5"
                fill="none"
              />
            ))}
          </svg>
        </div>
        <div className="max-w-6xl mx-auto relative z-[2]">
          <div className="devdark-fade">
            <div className="devdark-label text-[clamp(70px,14vw,180px)] text-[#0d150d] leading-[0.88] tracking-[-2px]">
              CONTACT
            </div>
            <div className="devdark-label text-[clamp(70px,14vw,180px)] text-[#0d150d] leading-[0.88] tracking-[-2px]">
              ME
            </div>
          </div>

          <div className="devdark-fade mt-6 flex flex-wrap items-center gap-3">
            {p.email && (
              <a
                href={`mailto:${p.email}`}
                className="inline-flex items-center gap-2 bg-[#0d150d] text-[#c8f53c] rounded-full px-6 py-3 font-semibold hover:translate-y-0.5 transition-transform"
              >
                Email
                <span className="opacity-80">{p.email}</span>
              </a>
            )}
            {p.linkedIn && (
              <a
                href={p.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#0d150d]/30 text-[#0d150d] rounded-full px-6 py-3 font-semibold hover:bg-[#0d150d] hover:text-[#c8f53c] transition-colors"
              >
                LinkedIn
              </a>
            )}
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-[#0d150d]/30 text-[#0d150d] rounded-full px-6 py-3 font-semibold hover:bg-[#0d150d] hover:text-[#c8f53c] transition-colors"
              >
                GitHub
              </a>
            )}
          </div>

          {(volunteering.length > 0 || sportsArts.length > 0) && (
            <p className="devdark-fade mt-6 text-sm text-[#0d150d]/80 max-w-3xl">
              {[
                volunteering.length > 0 ? `Volunteering: ${volunteering.map((v) => v.organization).filter(Boolean).slice(0, 2).join(', ')}` : null,
                sportsArts.length > 0 ? `Interests: ${sportsArts.map((s) => s.name).filter(Boolean).slice(0, 4).join(', ')}` : null,
              ].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <div className="bg-[#0d150d] flex justify-center items-center gap-8 md:gap-16 px-6 py-5">
        {NAV.map((n) => (
          <button
            key={n.id}
            type="button"
            onClick={() => go(n.id)}
            className="text-[13px] text-[rgba(232,240,216,0.45)] hover:text-[#c8f53c] transition-colors"
          >
            {n.label}
          </button>
        ))}
      </div>
      <div className="bg-[#0d150d] text-center px-6 pt-5 pb-10">
        <div className="devdark-heroTitle text-[clamp(50px,12vw,150px)] text-[rgba(255,255,255,0.07)] tracking-[-2px] leading-none">
          {name.toUpperCase()}
        </div>
      </div>
    </div>
  );
}

