import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
const PORTFOLIOS_KEY = 'genc_portfolios';

const getTemplateSlug = (templateId) => {
  if (templateId === 'card') return 'showcase';
  if (templateId === 'creative') return 'creative';
  if (templateId === 'developerDark') return 'creative-pro';
  return 'developer';
};

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
  const { stepId } = useParams();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (stepId) {
      const idx = STEPS.findIndex((s) => s.id === stepId);
      if (idx !== -1) setStep(idx);
    }
  }, [stepId]);

  const [data, setData] = useState(initialDossier);
  const [savedId, setSavedId] = useState(null);
  const [shareId, setShareId] = useState(null);
  const [resumeTemplates, setResumeTemplates] = useState([]);
  const [webTemplates, setWebTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [portfolios, setPortfolios] = useState([]);

  const storageKey = user?.email ? `${PROFILE_DOSSIER_KEY}_${user.email}` : null;
  const portfoliosKey = PORTFOLIOS_KEY;

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

    try {
      const rawPortfolios = localStorage.getItem(portfoliosKey);
      if (rawPortfolios) {
        const parsed = JSON.parse(rawPortfolios);
        if (Array.isArray(parsed)) {
          setPortfolios(parsed);
        } else if (parsed && typeof parsed === 'object') {
          const migrated = Object.entries(parsed).map(([id, value]) => ({
            id,
            template: 'developer',
            data: value,
          }));
          setPortfolios(migrated);
          localStorage.setItem(portfoliosKey, JSON.stringify(migrated));
        }
      }
    } catch (_) {}
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

      try {
        const raw = localStorage.getItem(portfoliosKey);
        let list = [];
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            list = parsed;
          } else if (parsed && typeof parsed === 'object') {
            list = Object.entries(parsed).map(([id, value]) => ({
              id,
              template: 'developer',
              data: value,
            }));
          }
        }

        const templateId = data.webPortfolioTemplateId || initialDossier.webPortfolioTemplateId;
        const templateSlug = getTemplateSlug(templateId);

        let entry = list.find((p) => p.template === templateSlug);
        if (!entry) {
          let newId;
          try {
            if (window.crypto?.randomUUID) {
              newId = window.crypto.randomUUID();
            } else {
              newId = Math.random().toString(16).slice(2) + Date.now().toString(16);
            }
          } catch (_) {
            newId = Math.random().toString(16).slice(2) + Date.now().toString(16);
          }
          entry = { id: newId, template: templateSlug, data };
          list.push(entry);
        } else {
          entry.data = data;
        }

        localStorage.setItem(portfoliosKey, JSON.stringify(list));
        setPortfolios(list);
      } catch (_) {}

      return true;
    } catch (e) {
      setError(e.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const computeStepErrors = (stepId, currentData) => {
    const errs = {};

    if (stepId === 'profile') {
      const p = currentData.profile || {};
      if (!p.email?.trim()) errs['profile.email'] = true;
      if (!p.phone?.trim()) errs['profile.phone'] = true;
      if (!p.location?.trim()) errs['profile.location'] = true;
      if (!p.role?.trim()) errs['profile.role'] = true;
      if (!p.cognizantId?.trim()) errs['profile.cognizantId'] = true;
      if (!p.track?.trim()) errs['profile.track'] = true;
      if (!p.linkedIn?.trim()) errs['profile.linkedIn'] = true;
      if (!p.github?.trim()) errs['profile.github'] = true;
    }

    if (stepId === 'education') {
      const list = currentData.education || [];
      list.forEach((edu, index) => {
        if (!edu.degree?.trim()) errs[`education.${index}.degree`] = true;
        if (!edu.institution?.trim()) errs[`education.${index}.institution`] = true;
        if (!edu.year?.trim()) errs[`education.${index}.year`] = true;
        if (!edu.stream?.trim()) errs[`education.${index}.stream`] = true;
        if (!edu.percentage?.trim()) errs[`education.${index}.percentage`] = true;
      });
    }

    if (stepId === 'skills') {
      const skills = currentData.technicalSkills || [];
      skills.forEach((group) => {
        const cat = group.category;
        (group.items || []).forEach((item, index) => {
          if (!item?.trim()) errs[`technicalSkills.${cat}.${index}`] = true;
        });
      });
    }

    if (stepId === 'capstone') {
      const cap = currentData.capstoneProject || {};
      if (!cap.title?.trim()) errs['capstoneProject.title'] = true;
      if (!cap.description?.trim()) errs['capstoneProject.description'] = true;
      if (!cap.role?.trim()) errs['capstoneProject.role'] = true;
      (cap.techStack || []).forEach((item, index) => {
        if (!item?.trim()) errs[`capstoneProject.techStack.${index}`] = true;
      });
      (cap.responsibilities || []).forEach((item, index) => {
        if (!item?.trim()) errs[`capstoneProject.responsibilities.${index}`] = true;
      });
      (cap.outcomes || []).forEach((item, index) => {
        if (!item?.trim()) errs[`capstoneProject.outcomes.${index}`] = true;
      });
    }

    if (stepId === 'achievements') {
      const achievements = currentData.achievements || [];
      achievements.forEach((a, index) => {
        if (!a.title?.trim()) errs[`achievements.${index}.title`] = true;
        if (!a.description?.trim()) errs[`achievements.${index}.description`] = true;
        if (!a.date?.trim()) errs[`achievements.${index}.date`] = true;
      });
      const volunteering = currentData.volunteering || [];
      volunteering.forEach((v, index) => {
        if (!v.organization?.trim()) errs[`volunteering.${index}.organization`] = true;
        if (!v.role?.trim()) errs[`volunteering.${index}.role`] = true;
        if (!v.description?.trim()) errs[`volunteering.${index}.description`] = true;
        if (!v.duration?.trim()) errs[`volunteering.${index}.duration`] = true;
      });
    }

    return errs;
  };

  const validateStep = (index) => {
    const s = STEPS[index];
    if (!s) return true;
    const stepId = s.id;
    const stepErrors = computeStepErrors(stepId, data);

    setValidationErrors((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        if (key.startsWith(`${stepId}.`)) delete next[key];
      });
      return { ...next, ...stepErrors };
    });

    return Object.keys(stepErrors).length === 0;
  };

  const validateAllRequiredSections = () => {
    const sectionIds = ['profile', 'education', 'skills', 'capstone', 'achievements'];
    const allErrors = {};
    sectionIds.forEach((id) => {
      Object.assign(allErrors, computeStepErrors(id, data));
    });
    setValidationErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const currentStep = STEPS[step];
  const StepComponent = currentStep?.component;
  const currentTemplateSlug = getTemplateSlug(data.webPortfolioTemplateId || initialDossier.webPortfolioTemplateId);
  const currentPortfolio = portfolios.find((p) => p.template === currentTemplateSlug) || null;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
          
          {/* Sidebar Navigation - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-24">
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden p-4">
              <div className="mb-6 px-4 pt-2">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Builder Steps</h2>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                    <div 
                      className="h-full bg-primary-600 transition-all duration-500 ease-out"
                      style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-primary-600 dark:text-primary-400">
                    {Math.round(((step + 1) / STEPS.length) * 100)}%
                  </span>
                </div>
              </div>
              
              <nav className="space-y-1">
                {STEPS.map((s, i) => {
                  const Icon = STEP_ICONS[s.id];
                  const isActive = step === i;
                  const isPast = step > i;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        if (i > step) {
                          const ok = validateStep(step);
                          if (!ok) return;
                        }
                        setStep(i);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                        isActive 
                          ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-none' 
                          : isPast
                          ? 'text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                          : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                        isActive ? 'bg-white/20' : isPast ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-800'
                      }`}>
                        {Icon && Icon('w-4 h-4')}
                      </div>
                      <span className="flex-1 text-left">{s.title}</span>
                      {isPast && !isActive && (
                        <svg className="w-4 h-4 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 min-w-0 max-w-4xl">
            {/* Header - Mobile Only */}
            <header className="mb-8 lg:hidden">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Build your dossier</h1>
              <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
                {STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (i > step) {
                        const ok = validateStep(step);
                        if (!ok) return;
                      }
                      setStep(i);
                    }}
                    className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      step === i ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400'
                    }`}
                  >
                    {STEP_ICONS[s.id] && STEP_ICONS[s.id]('w-5 h-5')}
                  </button>
                ))}
              </div>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden min-h-[60vh] flex flex-col">
              {error && (
                <div className="m-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm flex items-center gap-3">
                  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  {error}
                </div>
              )}

              <div className="p-6 sm:p-10 flex-1">
                <div className="mb-8 flex items-center justify-between">
                   <div>
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{currentStep.title}</h2>
                     <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Section {step + 1} of {STEPS.length}</p>
                   </div>
                   <div className="hidden sm:block">
                      <div className="text-right">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Dossier Status</div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${savedId ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                          {savedId ? 'Synced to Cloud' : 'Draft Only'}
                        </div>
                      </div>
                   </div>
                </div>

                {StepComponent && (
                  <StepComponent
                    data={data}
                    update={update}
                    save={save}
                    dossierId={savedId}
                    setSavedId={setSavedId}
                    loading={loading}
                    savedId={savedId}
                    shareId={shareId}
                    portfolioId={currentPortfolio?.id}
                    portfolioTemplate={currentTemplateSlug}
                    resumeTemplates={resumeTemplates}
                    webTemplates={webTemplates}
                    validationErrors={validationErrors}
                    onNext={() => {
                      const ok = validateStep(step);
                      if (ok) {
                        setStep((s) => Math.min(s + 1, STEPS.length - 1));
                      }
                    }}
                    onPrev={() => setStep((s) => Math.max(s - 1, 0))}
                    isFirst={step === 0}
                    isLast={step === STEPS.length - 1}
                    onValidateAll={validateAllRequiredSections}
                  />
                )}
              </div>

              {/* Navigation Footer */}
              <div className="px-6 sm:px-10 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(s - 1, 0))}
                  disabled={step === 0}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back
                </button>
                
                <div className="flex items-center gap-3">
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={async () => {
                        const valid = validateStep(step);
                        if (!valid) return;
                        const ok = await save();
                        if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
                      }}
                      disabled={loading}
                      className="group flex items-center gap-2 px-8 py-3 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-xl shadow-primary-200 dark:shadow-none transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save & Continue'}
                      {!loading && <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>}
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
