import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLatestDossier } from '../api/client';

export default function Home() {
  const [dossier, setDossier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLatestDossier()
      .then((d) => {
        if (d && d._id) setDossier(d);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const projects = dossier?.projects || (dossier?.capstoneProject ? [dossier.capstoneProject] : []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
      <div className="mb-12">
        <h1 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
          {dossier ? `Welcome back, ${dossier.profile?.name || 'User'}!` : 'Welcome to GenC Dossier'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg">
          {dossier 
            ? 'Manage your professional brand and keep your dossier up to date.' 
            : 'Get started by creating your professional dossier and portfolio.'}
        </p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="space-y-8">
          {!dossier ? (
            <div className="p-8 rounded-3xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-xl shadow-primary-200 dark:shadow-none overflow-hidden relative group">
              <div className="relative z-10 text-center py-8">
                <h2 className="text-3xl font-bold mb-4">Create your first dossier</h2>
                <p className="text-primary-100 mb-8 max-w-md mx-auto">
                  Build a professional LaTeX resume and a stunning web portfolio in minutes. 
                  Share your link with recruiters instantly.
                </p>
                <Link
                  to="/build"
                  className="inline-flex items-center px-8 py-4 bg-white text-primary-700 font-bold rounded-xl hover:bg-primary-50 transition-colors shadow-lg text-lg"
                >
                  Start Building
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </Link>
              </div>
              <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary-500/20 rounded-full blur-3xl group-hover:bg-primary-400/30 transition-colors"></div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Your Dossier</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Overview of your professional profile</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/build"
                    className="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition text-sm"
                  >
                    Edit Dossier
                  </Link>
                  <Link
                    to="/app/profile"
                    className="px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition shadow-md shadow-primary-100 dark:shadow-none text-sm"
                  >
                    View Profile Details
                  </Link>
                </div>
              </div>
              
              <div className="p-8 grid lg:grid-cols-12 gap-10">
                {/* Left Side: Core Info, Skills, Achievements */}
                <div className="lg:col-span-7 space-y-10">
                  {/* Top Row: Core Info & Skills Overview */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Core Information</h3>
                      <div className="flex items-center gap-4">
                        {dossier.profile?.photoUrl ? (
                          <img src={dossier.profile.photoUrl} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 dark:border-slate-700" alt="" />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-2xl">👤</div>
                        )}
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white">{dossier.profile?.name}</div>
                          <div className="text-sm text-primary-600 dark:text-primary-400 font-medium">{dossier.profile?.role || 'Role not set'}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{dossier.profile?.location}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Skills Overview</h3>
                      <div className="flex flex-wrap gap-2">
                        {dossier.technicalSkills?.slice(0, 2).map((cat) => 
                          cat.items?.slice(0, 4).map((skill, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-100 dark:border-slate-600">
                              {skill}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Achievements below Core Info and Skills */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Achievements</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {dossier.achievements?.length > 0 ? (
                        dossier.achievements.slice(0, 4).map((achievement, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800">
                            <span className="text-amber-500 mt-0.5 text-sm">★</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                              {achievement.title || achievement.description || 'Achievement'}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 italic">No achievements added yet.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Side: Projects Overview */}
                <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-700 pt-8 lg:pt-0 lg:pl-10">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Projects Overview</h3>
                  <div className="space-y-4">
                    {projects.length > 0 ? (
                      projects.slice(0, 2).map((proj, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-primary-50/30 dark:bg-primary-900/10 border border-primary-100/50 dark:border-primary-900/20">
                          <div className="font-bold text-md text-slate-900 dark:text-white mb-1 truncate">{proj.title || 'Untitled Project'}</div>
                          <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-2 uppercase tracking-wider">{proj.role}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                            {proj.description || 'No description provided.'}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-dashed border-slate-200 dark:border-slate-700 text-center">
                        <p className="text-sm text-slate-500 italic">No projects added yet.</p>
                      </div>
                    )}
                    {projects.length > 2 && (
                      <p className="text-center text-xs text-slate-400 font-medium italic">
                        + {projects.length - 2} more projects
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
