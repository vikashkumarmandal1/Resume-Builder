import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLatestDossier } from '../api/client';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLatestDossier()
      .then((d) => setDossier(d))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const p = dossier?.profile || {};
  const education = dossier?.education || [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Profile
        </h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400 text-sm">
          Your saved candidate profile and education details.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700" />
            <span className="text-sm text-slate-500 dark:text-slate-400">Loading…</span>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}

      {!loading && (
      <div className="space-y-8">
        {/* Candidate profile card */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              Candidate profile
            </h2>
            <Link
              to="/build"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
          </div>
          <div className="p-6">
            {dossier ? (
              <div className="flex flex-col sm:flex-row gap-6">
                {/* <div className="shrink-0 flex justify-center sm:justify-start">
                  <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center">
                    <span className="text-2xl font-semibold text-slate-400 dark:text-slate-500">
                      {(() => {
                        const name = String(p.name || user?.name || user?.email || '?').trim();
                        const initial = name.charAt(0).toUpperCase();
                        return initial || '?';
                      })()}
                    </span>
                  </div>
                </div> */}

<div className="shrink-0 flex justify-center sm:justify-start">
  <div className="w-24 h-24 rounded-xl bg-slate-100 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 flex items-center justify-center overflow-hidden">
    {/* Check karein ki photoUrl hai ya nahi */}
    {p.photoUrl || user?.photoUrl ? (
      <img 
        src={p.photoUrl || user?.photoUrl} 
        alt="Profile" 
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="text-2xl font-semibold text-slate-400 dark:text-slate-500">
        {(() => {
          const name = String(p.name || user?.name || user?.email || '?').trim();
          const initial = name.charAt(0).toUpperCase();
          return initial || '?';
        })()}
      </span>
    )}
  </div>
</div>


                <div className="flex-1 grid sm:grid-cols-2 gap-4 min-w-0">
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</p>
                    <p className="text-slate-900 dark:text-white font-medium">{p.name || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-slate-900 dark:text-white">{p.email || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone</p>
                    <p className="text-slate-900 dark:text-white">{p.phone || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Location</p>
                    <p className="text-slate-900 dark:text-white">{p.location || '—'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role / Track</p>
                    <p className="text-slate-900 dark:text-white">{p.role || '—'} {p.track ? ` · ${p.track}` : ''}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cognizant ID</p>
                    <p className="text-slate-900 dark:text-white">{p.cognizantId || '—'}</p>
                  </div>
                  {(p.linkedIn || p.github) && (
                    <div className="sm:col-span-2 flex flex-wrap gap-3">
                      {p.linkedIn && (
                        <a href={p.linkedIn} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
                          LinkedIn
                        </a>
                      )}
                      {p.github && (
                        <a href={p.github} target="_blank" rel="noopener noreferrer" className="text-primary-600 dark:text-primary-400 hover:underline text-sm">
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <p className="text-slate-500 dark:text-slate-400 text-sm">No dossier saved yet. Build your first dossier to see your profile here.</p>
                <Link
                  to="/build"
                  className="inline-block mt-4 px-4 py-2 rounded-lg bg-primary-600 text-white text-sm font-medium hover:bg-primary-500"
                >
                  Build Dossier
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Education */}
        <section className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">
              Education
            </h2>
          </div>
          <div className="p-6">
            {education.length > 0 ? (
              <ul className="space-y-4">
                {education.map((edu, i) => (
                  <li key={i} className="pb-4 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                    <p className="font-medium text-slate-900 dark:text-white">{edu.degree || '—'}</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{edu.institution || '—'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">
                      {[edu.year, edu.stream, edu.percentage].filter(Boolean).join(' · ') || '—'}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p className="text-slate-500 dark:text-slate-400 text-sm">No education entries yet. Add them in Build Dossier.</p>
                <Link
                  to="/build"
                  className="inline-block mt-4 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50"
                >
                  Build Dossier
                </Link>
              </>
            )}
          </div>
        </section>

        {/* Logout */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 text-white font-medium hover:bg-red-500 transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
      )}
    </div>
  );
}
