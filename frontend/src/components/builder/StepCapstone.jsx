import { Trash2, Plus } from 'lucide-react';

function TagList({ items, onChange, placeholder, baseKey, validationErrors = {} }) {
  const add = () => onChange([...(items || []), '']);
  const set = (i, v) => {
    const next = [...(items || [])];
    next[i] = v;
    onChange(next);
  };
  const remove = (i) => onChange((items || []).filter((_, idx) => idx !== i));

  return (
    <div className="space-y-2">
      {(items || []).map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => set(i, e.target.value)}
            placeholder={placeholder}
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 px-3 py-2"
            style={
              baseKey && validationErrors[`${baseKey}.${i}`]
                ? { border: '1px solid red' }
                : undefined
            }
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-red-600 dark:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            aria-label="Remove item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
        <Plus size={14} /> Add item
      </button>
    </div>
  );
}

export default function StepCapstone({ data, update, validationErrors = {} }) {
  // We use data.projects primarily, but fallback to data.capstoneProject for existing users
  const projects = data.projects || (data.capstoneProject ? [data.capstoneProject] : [{ title: '', techStack: [], description: '', role: '', responsibilities: [], outcomes: [] }]);

  const add = () => {
    update('projects', [...projects, { title: '', techStack: [], description: '', role: '', responsibilities: [], outcomes: [] }]);
  };

  const remove = (i) => {
    update('projects', projects.filter((_, idx) => idx !== i));
  };

  const change = (i, field, value) => {
    const next = [...projects];
    next[i] = { ...next[i], [field]: value };
    update('projects', next);
    // Also update capstoneProject for backward compatibility if it's the first project
    if (i === 0) {
      update('capstoneProject', next[0]);
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Projects</h2>
      </div>

      {projects.map((proj, i) => (
        <div key={i} className="p-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4">
            <h3 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs">
                {i + 1}
              </span>
              Project Details
            </h3>
            <button 
              type="button" 
              onClick={() => remove(i)} 
              className="text-red-600 dark:text-red-400 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              <Trash2 size={14} /> Remove
            </button>
          </div>

          <div className="grid gap-6">
            <label className="block">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Project title</span>
              <input
                type="text"
                value={proj.title || ''}
                onChange={(e) => change(i, 'title', e.target.value)}
                className="mt-2 block w-full p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                style={validationErrors[`projects.${i}.title`] ? { border: '1px solid red' } : undefined}
                placeholder="e.g. E-commerce Platform"
              />
              {validationErrors[`projects.${i}.title`] && (
                <p className="text-xs text-red-500 mt-1 ml-1">Please fill this detail</p>
              )}
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Tech stack</span>
              <div className="mt-2">
                <TagList
                  items={proj.techStack || []}
                  onChange={(v) => change(i, 'techStack', v)}
                  placeholder="e.g. React, Node.js"
                  baseKey={`projects.${i}.techStack`}
                  validationErrors={validationErrors}
                />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Project Description</span>
              <textarea
                value={proj.description || ''}
                onChange={(e) => change(i, 'description', e.target.value)}
                className="mt-2 block w-full h-32 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none resize-none"
                style={validationErrors[`projects.${i}.description`] ? { border: '1px solid red' } : undefined}
                placeholder="Briefly describe the project, its goals, and impact..."
              />
              {validationErrors[`projects.${i}.description`] && (
                <p className="text-xs text-red-500 mt-1 ml-1">Please fill this detail</p>
              )}
            </label>

            <div className="grid sm:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Your role</span>
                <input
                  type="text"
                  value={proj.role || ''}
                  onChange={(e) => change(i, 'role', e.target.value)}
                  className="mt-2 block w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
                  style={validationErrors[`projects.${i}.role`] ? { border: '1px solid red' } : undefined}
                  placeholder="e.g. Lead Developer"
                />
                {validationErrors[`projects.${i}.role`] && (
                  <p className="text-xs text-red-500 mt-1 ml-1">Please fill this detail</p>
                )}
              </label>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <label className="block">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Responsibilities</span>
                <div className="mt-2">
                  <TagList
                    items={proj.responsibilities || []}
                    onChange={(v) => change(i, 'responsibilities', v)}
                    placeholder="Describe a key responsibility..."
                    baseKey={`projects.${i}.responsibilities`}
                    validationErrors={validationErrors}
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Key outcomes</span>
                <div className="mt-2">
                  <TagList
                    items={proj.outcomes || []}
                    onChange={(v) => change(i, 'outcomes', v)}
                    placeholder="e.g. Reduced latency by 20%"
                    baseKey={`projects.${i}.outcomes`}
                    validationErrors={validationErrors}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="w-full py-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-all flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Add Another Project
      </button>
    </section>
  );
}
