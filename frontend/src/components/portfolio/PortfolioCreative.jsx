// Creative – Wall of Portfolios style: name-forward, About narrative, experience highlight, clean designer layout.
// Inspired by: https://www.wallofportfolios.in/portfolios/advait-shripad-ramdasi/

function SkillBadge({ name }) {
  return (
    <span
      className="inline-block px-3 py-1.5 text-sm font-medium text-slate-700 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700"
      title={name}
    >
      {name}
    </span>
  );
}

export default function PortfolioCreative({ dossier }) {
  const p = dossier?.profile || {};
  const edu = dossier?.education || [];
  const skills = dossier?.technicalSkills || [];
  const cap = dossier?.capstoneProject || {};
  const achievements = dossier?.achievements || [];
  const volunteering = dossier?.volunteering || [];
  const sportsArts = dossier?.sportsArts || [];
  const strengths = dossier?.strengths || [];

  const skillList = (skills || []).flatMap((s) => (s.items || []).filter(Boolean));
  const name = p.name || 'Portfolio';
  const role = p.role || p.track || 'Professional';
  const location = p.location || '';

  // Build narrative About from dossier
  const aboutParts = [];
  if (name) aboutParts.push(`${name.split(' ')[0]} is a ${role}${location ? ` based in ${location}` : ''}`);
  if (strengths.length > 0) aboutParts.push(`Specializing in ${strengths.map((s) => s.name).join(', ')}.`);
  if (cap?.title) aboutParts.push(`Recent work includes ${cap.title}.`);
  if (skillList.length > 0) aboutParts.push(`Expertise spans ${skillList.slice(0, 6).join(', ')}${skillList.length > 6 ? ' and more' : ''}.`);
  const aboutText = aboutParts.length > 0
    ? aboutParts.join(' ')
    : `Welcome to my portfolio. I focus on ${role} and bringing ideas to life with clarity and creativity.`;

  const primarySkills = (skills.find((s) => s.category === 'programming') || { items: [] }).items || [];
  const frameworkSkills = (skills.find((s) => s.category === 'fullstack') || { items: [] }).items || [];
  const toolSkills = (skills.find((s) => s.category === 'tools') || { items: [] }).items || [];

  const works = [
    cap.title && {
      title: cap.title,
      subtitle: cap.role || 'Capstone project',
    },
    ...achievements.map((a) => ({
      title: a.title,
      subtitle: a.date || a.description || '',
    })),
  ].filter(Boolean);

  const galleryCards = [
    primarySkills.length > 0 && {
      label: 'Tech Stack',
      items: primarySkills.slice(0, 5),
    },
    frameworkSkills.length > 0 && {
      label: 'Frameworks',
      items: frameworkSkills.slice(0, 5),
    },
    (sportsArts.length > 0 || strengths.length > 0) && {
      label: 'Beyond Work',
      items: [
        ...sportsArts.map((s) => s.name),
        ...strengths.map((s) => s.name),
      ].slice(0, 5),
    },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-slate-950 text-lime-100 antialiased">
      {/* HERO */}
      <section className="relative min-h-[70vh] flex flex-col justify-center items-center text-center px-6 bg-gradient-to-br from-lime-300 via-lime-400 to-lime-500 rounded-b-[36px] text-slate-900">
        <h1 className="text-[40px] sm:text-[64px] md:text-[80px] lg:text-[96px] font-extrabold tracking-tight leading-none portfolio-reveal">
          {name.toUpperCase()}
        </h1>
        <p className="mt-3 text-sm sm:text-base max-w-xl portfolio-reveal portfolio-reveal-delay-1">
          {aboutText}
        </p>
        <nav className="flex flex-wrap justify-center gap-6 mt-8 text-xs sm:text-sm font-medium portfolio-reveal portfolio-reveal-delay-2">
          <button
            type="button"
            onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:underline"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('works')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:underline"
          >
            Work
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:underline"
          >
            Skills
          </button>
          <button
            type="button"
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="hover:underline"
          >
            Contact
          </button>
        </nav>

        {role && (
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-900/80 text-lime-200 px-4 py-1.5 text-xs font-semibold portfolio-reveal portfolio-reveal-delay-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400" />
            {role}
          </span>
        )}
      </section>

      <main className="max-w-5xl mx-auto px-6 py-14 md:py-16">
        {/* ABOUT */}
        <section
          id="about"
          className="py-10 text-center portfolio-reveal"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            About
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-lime-200/90">
            {aboutText}
            {strengths.length > 0 && (
              <span className="block mt-4 text-lime-300/90">
                Known for{' '}
                {strengths
                  .map((s) => s.name)
                  .filter(Boolean)
                  .slice(0, 3)
                  .join(', ')}
                .
              </span>
            )}
          </p>
          <div className="mt-10 flex justify-center">
            {p.photoUrl ? (
              <img
                src={p.photoUrl}
                alt={p.name}
                className="w-52 h-52 rounded-full object-cover shadow-2xl border-4 border-slate-900"
              />
            ) : (
              <div className="w-52 h-52 rounded-full bg-lime-300 flex items-center justify-center shadow-2xl text-slate-900 font-display font-semibold text-xl uppercase tracking-wide">
                {primarySkills.length > 0 ? 'Tech Stack' : 'Profile'}
              </div>
            )}
          </div>
        </section>

        {/* WORKS – capstone + achievements */}
        {works.length > 0 && (
          <section
            id="works"
            className="py-10 portfolio-reveal portfolio-reveal-delay-1"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center tracking-tight">
              Work
            </h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {works.map((item, index) => (
                <button
                  key={index}
                  type="button"
                  className="w-full flex justify-between items-center border-b border-lime-900/60 py-4 text-left group"
                >
                  <div>
                    <span className="block text-sm sm:text-base font-medium text-lime-50">
                      {item.title}
                    </span>
                    {item.subtitle && (
                      <span className="block text-xs text-lime-300/80 mt-1">
                        {item.subtitle}
                      </span>
                    )}
                  </div>
                  <span className="text-lime-200 group-hover:translate-x-1 transition-transform">
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
              ))}
            </div>
          </section>
        )}

        {/* GALLERY – skills / beyond work cards */}
        {galleryCards.length > 0 && (
          <section
            id="gallery"
            className="py-10 text-center portfolio-reveal portfolio-reveal-delay-2"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 tracking-tight">
              Skills & Focus
            </h2>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {galleryCards.map((card, i) => (
                <div
                  key={card.label}
                  className="h-52 rounded-3xl bg-gradient-to-br from-lime-300/80 to-lime-500/80 text-slate-900 shadow-xl flex flex-col justify-between p-5 text-left"
                >
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-800/80">
                      {card.label}
                    </p>
                    <ul className="mt-3 space-y-1 text-sm">
                      {card.items.map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-900" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <span className="text-[11px] text-slate-800/70">
                    {i === 0 && 'Core technologies I work with.'}
                    {i === 1 && 'Frameworks and platforms I use.'}
                    {i === 2 && 'What keeps me inspired beyond code.'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* EDUCATION / JOURNEY */}
        {edu.length > 0 && (
          <section className="py-10 portfolio-reveal portfolio-reveal-delay-3">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center tracking-tight">
              Journey
            </h2>
            <div className="mt-4 border-t border-lime-900/60">
              {edu.map((e, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-lime-900/40 text-sm"
                >
                  <p className="text-lime-300/80 w-full sm:w-1/5">
                    {e.year || ''}
                  </p>
                  <p className="text-lime-50 font-medium w-full sm:w-2/5 mt-1 sm:mt-0">
                    {e.institution}
                  </p>
                  <p className="text-lime-200/80 w-full sm:w-2/5 mt-1 sm:mt-0">
                    {[e.degree, e.stream, e.percentage].filter(Boolean).join(' · ')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section
          id="contact"
          className="py-12 text-center bg-gradient-to-br from-lime-300 via-lime-400 to-lime-500 rounded-3xl mt-8 text-slate-900 portfolio-reveal portfolio-reveal-delay-4"
        >
          <h2 className="text-3xl sm:text-4xl md:text-[40px] font-extrabold tracking-tight">
            Let's work together
          </h2>
          <p className="mt-3 text-sm sm:text-base max-w-xl mx-auto text-slate-900/80">
            {p.email
              ? 'One email away from building something meaningful together.'
              : 'Reach out to collaborate on your next project.'}
          </p>
          {p.email && (
            <a
              href={`mailto:${p.email}`}
              className="inline-flex items-center justify-center mt-6 bg-slate-900 text-lime-200 px-7 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-transform text-sm"
            >
              Get in touch
            </a>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <footer className="py-6 text-center border-t border-lime-900/60 text-xs text-lime-400/80 px-6 mt-10">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-lime-200">
            {name}
          </h1>
          <div className="flex flex-wrap gap-4 justify-center sm:justify-end">
            {p.email && (
              <a
                href={`mailto:${p.email}`}
                className="hover:text-lime-100 transition-colors"
              >
                {p.email}
              </a>
            )}
            {p.linkedIn && (
              <a
                href={p.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lime-100 transition-colors"
              >
                LinkedIn
              </a>
            )}
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lime-100 transition-colors"
              >
                GitHub
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
