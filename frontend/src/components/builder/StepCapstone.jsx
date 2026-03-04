import { Trash2 } from 'lucide-react';
function TagList({ items, onChange, placeholder }) {
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
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-red-600 dark:text-red-400 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            aria-label="Remove skill"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button type="button" onClick={add} className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
        + Add
      </button>
    </div>
  );
}

export default function StepCapstone({ data, update }) {
  const cap = data.capstoneProject || {};

  const set = (field, value) => update('capstoneProject', { ...cap, [field]: value });

  return (
    <section className="space-y-4">
      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Capstone project</h2>
      <div className="space-y-4 p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800">
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Project title</span>
          <input
            type="text"
            value={cap.title || ''}
            onChange={(e) => set('title', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 px-3 py-2"
            placeholder="e.g. E-commerce Platform"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Tech stack (add one per line)</span>
          <TagList items={cap.techStack || []} onChange={(v) => set('techStack', v)} placeholder="e.g. React, Node.js" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Project Description</span>
          <textarea
            type="text"
            value={cap.description || ''}
            onChange={(e) => set('description', e.target.value)}
            className="mt-1 block w-full h-[150px] rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 px-3 py-2"
            placeholder="e.g. Write your description of project"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Your role</span>
          <input
            type="text"
            value={cap.role || ''}
            onChange={(e) => set('role', e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 px-3 py-2"
            placeholder="e.g. Full Stack Developer"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Responsibilities</span>
          <TagList items={cap.responsibilities || []} onChange={(v) => set('responsibilities', v)} placeholder="One per line" />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Key outcomes</span>
          <TagList items={cap.outcomes || []} onChange={(v) => set('outcomes', v)} placeholder="One per line" />
        </label>
      </div>
    </section>
  );
}
