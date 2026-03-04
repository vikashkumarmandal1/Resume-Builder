import { Trash2 } from 'lucide-react';
export default function StepStrengths({ data, update }) {
  const list = data.strengths || [];

  const add = () => update('strengths', [...list, { name: '', description: '' }]);
  const remove = (i) => update('strengths', list.filter((_, idx) => idx !== i));
  const change = (i, field, value) => {
    const next = [...list];
    next[i] = { ...next[i], [field]: value };
    update('strengths', next);
  };

  return (
    <section className="space-y-4">
      <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Skills & strengths (soft skills)</h2>
      <p className="text-slate-600 dark:text-slate-300 text-sm">e.g. Communication, teamwork, problem-solving</p>
      {list.map((item, i) => (
        <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 flex gap-3">
          <input
            type="text"
            required
            placeholder="Strength name"
            value={item.name || ''}
            onChange={(e) => change(i, 'name', e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 px-3 py-2"
          />
          <input
            type="text"
            required
            placeholder="Brief description"
            value={item.description || ''}
            onChange={(e) => change(i, 'description', e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 px-3 py-2"
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="text-red-600 dark:text-red-400 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors shrink-0"
            aria-label="Delete"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="px-4 py-2 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-primary-500"
      >
        + Add strength
      </button>
    </section>
  );
}
