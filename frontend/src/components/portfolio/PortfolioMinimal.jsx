import { useState } from 'react';

export default function PortfolioMinimal({ dossier }) {
  const p = dossier?.profile || {};
  const edu = dossier?.education || [];
  const skills = dossier?.technicalSkills || [];
  const cap = dossier?.capstoneProject || {};
  const achievements = dossier?.achievements || [];
  const sportsArts = dossier?.sportsArts || [];
  const strengths = dossier?.strengths || [];

  const [hoveredRow, setHoveredRow] = useState(null);

  const fullName = p.name || 'Your Name';
  const [firstName, ...rest] = fullName.split(' ');
  const lastName = rest.join(' ');

  const roleLine = [p.role, p.track].filter(Boolean).join(' · ');

  const socialLinks = [
    p.github && { label: 'GitHub', href: p.github },
    p.linkedIn && { label: 'LinkedIn', href: p.linkedIn },
    p.email && { label: 'Email', href: `mailto:${p.email}` },
  ].filter(Boolean);

  const projectTitle = cap.title || 'Featured project';
  const projectDesc =
    (cap.responsibilities || [])[0] ||
    (cap.outcomes || [])[0] ||
    'A highlight project from this portfolio.';

  const workRows = (() => {
    if (edu.length > 0) {
      return edu.map((e, idx) => [
        e.year || `#${idx + 1}`,
        e.institution || 'Education',
        [e.degree, e.stream, e.percentage].filter(Boolean).join(' · ') || 'Education',
      ]);
    }
    if (achievements.length > 0) {
      return achievements.map((a, idx) => [
        a.date || `#${idx + 1}`,
        a.title || 'Achievement',
        a.description || 'Achievement',
      ]);
    }
    return [
      ['Now', 'Portfolio', 'Add education or achievements to show your journey'],
    ];
  })();

  const workSummary =
    edu.length > 0
      ? `Education entries ${edu.length}`
      : achievements.length > 0
      ? `Achievements ${achievements.length}`
      : 'Experience grows with every project.';

  const aboutTextParts = [];
  if (p.name) {
    aboutTextParts.push(
      `Hello! I'm ${p.name}${p.role ? `, a ${p.role}` : ''}${p.track ? ` in ${p.track}` : ''}.`
    );
  }
  if (strengths.length > 0) {
    aboutTextParts.push(
      `I’m known for ${strengths
        .map((s) => s.name)
        .filter(Boolean)
        .slice(0, 3)
        .join(', ')}.`
    );
  }
  if (cap.title) {
    aboutTextParts.push(`Recently, I worked on ${cap.title}${cap.role ? ` as ${cap.role}` : ''}.`);
  }
  const aboutText =
    aboutTextParts.join(' ') ||
    'My goal is to write maintainable, clean and understandable code so development becomes enjoyable.';

  const frontEndSkills = (skills.find((s) => s.category === 'programming') || {}).items || [];
  const backEndSkills = (skills.find((s) => s.category === 'fullstack') || {}).items || [];
  const devOpsSkills = (skills.find((s) => s.category === 'tools') || {}).items || [];

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute w-[600px] h-[600px] bg-purple-600/10 blur-3xl rounded-full -top-52 -right-52 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8 md:py-10 relative">
        {/* Navbar */}
        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-400">
          <button
            type="button"
            onClick={() => scrollTo('hero')}
            className="cursor-pointer hover:text-white transition text-left"
          >
            <p>{firstName}</p>
            {lastName && <p>{lastName}</p>}
          </button>
          <div className="hidden md:flex gap-8">
            {['About', 'Projects', 'Contacts'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => scrollTo(item.toLowerCase())}
                className="relative cursor-pointer hover:text-white transition after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[1px] after:bg-white hover:after:w-full after:transition-all"
              >
                {item}
              </button>
            ))}
          </div>
          <div className="hidden sm:block hover:text-white transition cursor-default">
            {p.location || 'Portfolio'}
          </div>
        </div>

        {/* Hero Section */}
        <section id="hero" className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight cursor-default">
              {roleLine || 'Full-stack'}
              <br /> highlighted
              <br />
              Developer
            </h1>
            <p className="text-gray-400 mt-6 max-w-md text-sm sm:text-base">{aboutText}</p>

            <div className="flex gap-3 mt-6 text-[11px] sm:text-xs text-gray-400 flex-wrap">
              {socialLinks.length > 0
                ? socialLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.href.startsWith('http') ? '_blank' : undefined}
                      rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="border border-gray-700 px-4 py-2 rounded-full cursor-pointer hover:bg-white hover:text-black transition-colors"
                    >
                      {item.label}
                    </a>
                  ))
                : ['GitHub', 'LinkedIn', 'Email'].map((item) => (
                    <span
                      key={item}
                      className="border border-gray-700 px-4 py-2 rounded-full cursor-default text-gray-500"
                    >
                      {item}
                    </span>
                  ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-6">
            {p.photoUrl && (
              <img
                src={p.photoUrl}
                alt={p.name}
                className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl object-cover shadow-xl border border-gray-700"
              />
            )}
            <button
              type="button"
              onClick={() => scrollTo('projects')}
              className="flex items-center gap-3 bg-white text-black px-7 py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-transform text-sm"
            >
              Projects
              <span className="inline-flex w-4 h-4 items-center justify-center">
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="M13 6l6 6-6 6" />
                </svg>
              </span>
            </button>
          </div>
        </section>

        {/* Project Card */}
        <section id="projects" className="mt-16">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 cursor-default hover:shadow-2xl hover:shadow-purple-500/20 transition-transform">
            <div className="w-32 h-32 sm:w-40 sm:h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold">{projectTitle}</h3>
              <p className="text-gray-400 text-sm mt-2 max-w-md">{projectDesc}</p>
              {cap.techStack && cap.techStack.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-200">
                  {cap.techStack.slice(0, 5).map((t, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-gray-900 border border-gray-700">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <button
                type="button"
                onClick={() => scrollTo('contacts')}
                className="mt-4 bg-white text-black px-6 py-2 rounded-full text-sm hover:scale-105 transition-transform"
              >
                Contact about project
              </button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-gray-500 text-xs">... /About me ...</p>
            <h2 className="text-2xl md:text-3xl mt-4">
              {p.name
                ? `Hello! I'm ${p.name}, a ${roleLine || 'full-stack developer'}.`
                : "Hello! I'm a full-stack developer."}
            </h2>

            <div className="mt-8 space-y-4 text-sm text-gray-400">
              {frontEndSkills.length > 0 && (
                <div className="bg-gray-900 p-4 rounded-2xl cursor-default hover:bg-gray-800 transition">
                  <p className="font-semibold text-white">Front-end</p>
                  <p>{frontEndSkills.slice(0, 5).join(', ')}</p>
                </div>
              )}
              {backEndSkills.length > 0 && (
                <div className="bg-gray-900 p-4 rounded-2xl cursor-default hover:bg-gray-800 transition">
                  <p className="font-semibold text-white">Back-end</p>
                  <p>{backEndSkills.slice(0, 5).join(', ')}</p>
                </div>
              )}
              {devOpsSkills.length > 0 && (
                <div className="bg-gray-900 p-4 rounded-2xl cursor-default hover:bg-gray-800 transition">
                  <p className="font-semibold text-white">DevOps / Tools</p>
                  <p>{devOpsSkills.slice(0, 5).join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-72 h-96 bg-gray-800 rounded-3xl grayscale hover:grayscale-0 transition duration-500 flex items-center justify-center text-gray-500 text-xs text-center px-4">
              {sportsArts.length > 0 || strengths.length > 0
                ? [...sportsArts.map((s) => s.name), ...strengths.map((s) => s.name)]
                    .filter(Boolean)
                    .slice(0, 6)
                    .join(' · ')
                : 'Add sports, arts, and strengths in the builder to show more of who you are.'}
            </div>
          </div>
        </section>

        {/* Work Section */}
        <section className="mt-24">
          <h2 className="text-4xl md:text-6xl font-bold text-right">Work</h2>
          <div className="mt-10 border-t border-gray-800">
            {workRows.map((row, index) => (
              <div
                key={`${row[0]}-${index}`}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
                style={{
                  backgroundColor: hoveredRow === index ? 'rgba(255,255,255,0.05)' : 'transparent',
                }}
                className="flex flex-col sm:flex-row sm:justify-between py-6 border-b border-gray-800 text-gray-400 cursor-default transition-colors"
              >
                <p>{row[0]}</p>
                <p className="text-white">{row[1]}</p>
                <p>{row[2]}</p>
              </div>
            ))}
          </div>
          <p className="text-right text-gray-500 mt-4 text-xs sm:text-sm">{workSummary}</p>
        </section>
      </div>
    </div>
  );
}

// Developer – Modern portfolio: lime + purple accents, dark/light sections, hero, skill cards, projects.
import { useEffect} from 'react';

// Simple icons for skill categories
const SkillIcons = {
  programming: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  fullstack: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
    </svg>
  ),
  tools: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  certifications: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  default: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};



