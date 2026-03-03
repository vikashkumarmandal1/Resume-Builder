import { useState, useEffect } from 'react';
import {
  getResumeTemplates,
  getWebTemplates,
  getLatestDossier,
  createDossier,
  updateDossier,
} from '../api/client';
import { useAuth } from '../context/AuthContext';
import StepProfile from '../components/builder/StepProfile';
import StepEducation from '../components/builder/StepEducation';
import StepTechnicalSkills from '../components/builder/StepTechnicalSkills';
import StepCapstone from '../components/builder/StepCapstone';
import StepAchievements from '../components/builder/StepAchievements';
import StepSportsArts from '../components/builder/StepSportsArts';
import StepStrengths from '../components/builder/StepStrengths';
import StepOutput from '../components/builder/StepOutput';
import StepTemplates from '../components/builder/StepTemplates';

const STEP_ICONS = {
  profile: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  education: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  ),
  skills: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  capstone: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  achievements: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  ),
  sports: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  strengths: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  output: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  templates: (cls) => (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
    </svg>
  ),
};

const STEPS = [
  { id: 'profile', title: 'Profile', component: StepProfile },
  { id: 'education', title: 'Education', component: StepEducation },
  { id: 'skills', title: 'Technical Skills', component: StepTechnicalSkills },
  { id: 'capstone', title: 'Capstone Project', component: StepCapstone },
  { id: 'achievements', title: 'Achievements & Volunteering', component: StepAchievements },
  { id: 'sports', title: 'Sports & Arts', component: StepSportsArts },
  { id: 'strengths', title: 'Strengths', component: StepStrengths },
  { id: 'output', title: 'Choose output', component: StepOutput },
  { id: 'templates', title: 'Templates & Export', component: StepTemplates },
];

const PROFILE_DOSSIER_KEY = 'genc_dossier_profile';

const initialDossier = {
  profile: { name: '', email: '', phone: '', location: '', cognizantId: '', role: '', track: '', linkedIn: '', github: '' },
  education: [],
  technicalSkills: [
    { category: 'programming', items: [] },
    { category: 'fullstack', items: [] },
    { category: 'tools', items: [] },
    { category: 'certifications', items: [] },
  ],
  capstoneProject: { title: '', techStack: [], role: '', responsibilities: [], outcomes: [] },
  achievements: [],
  volunteering: [],
  sportsArts: [],
  strengths: [],
  outputType: 'both',
  resumeTemplateId: 'classic',
  webPortfolioTemplateId: 'minimal',
  enableWebPortfolio: true,
};

function mergeWithInitial(loaded) {
  if (!loaded || typeof loaded !== 'object') return initialDossier;
  const merged = JSON.parse(JSON.stringify(initialDossier));
  const walk = (target, source) => {
    if (!source || typeof source !== 'object') return;
    Object.keys(source).forEach((k) => {
      if (Array.isArray(target[k]) && Array.isArray(source[k])) {
        target[k] = source[k];
      } else if (target[k] != null && typeof target[k] === 'object' && !Array.isArray(target[k]) && source[k] != null && typeof source[k] === 'object' && !Array.isArray(source[k])) {
        walk(target[k], source[k]);
      } else if (source[k] !== undefined && source[k] !== '') {
        target[k] = source[k];
      }
    });
  };
  walk(merged, loaded);
  return merged;
}

export default function Builder() {
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(initialDossier);
  const [savedId, setSavedId] = useState(null);
  const [shareId, setShareId] = useState(null);
  const [resumeTemplates, setResumeTemplates] = useState([]);
  const [webTemplates, setWebTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const storageKey = user?.email ? `${PROFILE_DOSSIER_KEY}_${user.email}` : null;

  useEffect(() => {
    getResumeTemplates().then(setResumeTemplates).catch(console.error);
    getWebTemplates().then(setWebTemplates).catch(console.error);
  }, []);

  // Show form immediately with localStorage draft (if any), then sync from API in background
  useEffect(() => {
    if (storageKey) {
      try {
        const raw = localStorage.getItem(storageKey);
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed) {
          setData(mergeWithInitial(parsed));
        }
      } catch (_) {}
    }
    setLoaded(true);

    if (!storageKey) return;
    getLatestDossier()
      .then((d) => {
        if (d && d._id) {
          setData(mergeWithInitial(d));
          setSavedId(d._id);
          setShareId(d.shareId || null);
        }
      })
      .catch(() => {});
  }, [storageKey]);

  const update = (path, value) => {
    setData((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!(p in cur)) cur[p] = {};
        cur = cur[p];
      }
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const save = async () => {
    setLoading(true);
    setError(null);
    try {
      if (savedId) {
        const updated = await updateDossier(savedId, data);
        setShareId(updated.shareId);
      } else {
        const created = await createDossier(data);
        setSavedId(created._id);
        setShareId(created.shareId);
      }
      if (storageKey) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(data));
        } catch (_) {}
      }
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const currentStep = STEPS[step];
  const StepComponent = currentStep?.component;

  return (
    <div className="min-h-[80vh] bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Header */}
        <header className="mb-8 sm:mb-10">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Build your dossier
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Complete each section and choose a template to export PDF or share your portfolio.
          </p>
          {/* Step progress bar */}
          <div className="mt-6 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </header>

        {/* Step pills - horizontal scroll on small screens */}
        <div className="flex gap-2 overflow-x-auto pb-6 mb-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
          {STEPS.map((s, i) => {
            const Icon = STEP_ICONS[s.id];
            const isActive = step === i;
            const isPast = step > i;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setStep(i)}
                className={`shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                    : isPast
                    ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
              >
                {Icon && Icon('w-4 h-4 shrink-0')}
                <span className="hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">{s.title.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Content card */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 shadow-sm overflow-hidden">
          {error && (
            <div className="mx-6 mt-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
              {error}
            </div>
          )}

          <div className="p-6 sm:p-8">
            {StepComponent && (
              <StepComponent
                data={data}
                update={update}
                save={save}
                dossierId={savedId}
                loading={loading}
                savedId={savedId}
                shareId={shareId}
                resumeTemplates={resumeTemplates}
                webTemplates={webTemplates}
                onNext={() => setStep((s) => Math.min(s + 1, STEPS.length - 1))}
                onPrev={() => setStep((s) => Math.max(s - 1, 0))}
                isFirst={step === 0}
                isLast={step === STEPS.length - 1}
              />
            )}
          </div>

          {step < STEPS.length - 1 && (
            <div className="px-6 sm:px-8 py-4 border-t border-slate-100 dark:border-slate-700 flex justify-between gap-4">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={step === 0}
                className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 disabled:opacity-50 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={async () => {
                  const ok = await save();
                  if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
                }}
                disabled={loading}
                className="px-5 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 shadow-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving…' : 'Save & Next'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
