import type { Task } from "../types";

const STATUS_STYLE: Record<string, string> = {
  Backlog: "bg-neutral-700/60 text-neutral-300",
  Working: "bg-blue-900/60 text-blue-300",
  Review: "bg-amber-900/60 text-amber-300",
  Testing: "bg-violet-900/60 text-violet-300",
  Done: "bg-emerald-900/60 text-emerald-300",
  Failed: "bg-red-900/60 text-red-300",
  Blocked: "bg-orange-900/60 text-orange-300",
};

const ORDER = ["Backlog", "Working", "Review", "Testing", "Done", "Blocked", "Failed"];

export default function TaskBoard({ tasks }: { tasks: Task[] }) {
  const sorted = [...tasks].sort(
    (a, b) => (ORDER.indexOf(a.status) + 1 || 99) - (ORDER.indexOf(b.status) + 1 || 99),
  );
  return (
    <section className="flex min-h-0 flex-[3] flex-col rounded-lg border border-neutral-800 bg-neutral-900/60">
      <h2 className="border-b border-neutral-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        📋 Task Board ({tasks.length})
      </h2>
      <div className="min-h-0 flex-1 overflow-auto p-2">
        {tasks.length === 0 ? (
          <p className="p-2 text-sm text-neutral-500">ยังไม่มี task — ทีมยังไม่เคยเริ่มงาน</p>
        ) : (
          <table className="w-full border-collapse text-left text-[12px]">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-neutral-500">
                <th className="px-2 py-1">ID</th>
                <th className="px-2 py-1">Agent</th>
                <th className="px-2 py-1">Description</th>
                <th className="px-2 py-1">Deps</th>
                <th className="px-2 py-1">Status</th>
                <th className="px-2 py-1">Verification</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t.id} className="border-t border-neutral-800/70 align-top hover:bg-neutral-800/50" title={t.criteria}>
                  <td className="whitespace-nowrap px-2 py-1.5 font-mono text-neutral-300">{t.id}</td>
                  <td className="whitespace-nowrap px-2 py-1.5 text-neutral-400">{t.agent}</td>
                  <td className="max-w-56 truncate px-2 py-1.5">{t.description}</td>
                  <td className="px-2 py-1.5 text-neutral-500">{t.dependencies}</td>
                  <td className="px-2 py-1.5">
                    <span className={`whitespace-nowrap rounded px-1.5 py-0.5 font-medium ${STATUS_STYLE[t.status] ?? STATUS_STYLE.Backlog}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="max-w-40 truncate px-2 py-1.5 text-neutral-500" title={t.verification}>
                    {t.verification}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
