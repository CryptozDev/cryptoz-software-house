import type { AgentInfo } from "../types";

const STATUS_DOT: Record<string, string> = {
  Done: "bg-emerald-500",
  Completed: "bg-emerald-500",
  Working: "bg-blue-500 animate-pulse",
  Progress: "bg-blue-500 animate-pulse",
  Review: "bg-amber-500",
  Testing: "bg-violet-500",
  Warning: "bg-red-500",
  Bug: "bg-red-500",
  Failed: "bg-red-500",
};

export default function AgentSidebar({ agents }: { agents: AgentInfo[] }) {
  return (
    <aside className="flex min-h-0 flex-col rounded-lg border border-neutral-800 bg-neutral-900/60">
      <h2 className="border-b border-neutral-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        👥 Agents ({agents.length})
      </h2>
      <ul className="min-h-0 flex-1 overflow-y-auto p-1.5">
        {agents.map((a) => {
          const active = Boolean(a.lastTime);
          const dot = a.lastStatus ? STATUS_DOT[a.lastStatus] : undefined;
          return (
            <li key={a.id} className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-neutral-800" title={a.title}>
              <span className="text-base leading-none">{a.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[13px] font-medium">
                  {a.name}
                  <span
                    className={`inline-block h-1.5 w-1.5 shrink-0 rounded-full ${dot ?? (active ? "bg-blue-500" : "bg-neutral-700")}`}
                  />
                </div>
                <div className="truncate text-[11px] text-neutral-500">
                  {active ? `${a.lastType}${a.lastStatus ? ` · ${a.lastStatus}` : ""} · ${a.lastTime}` : "Idle"}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
