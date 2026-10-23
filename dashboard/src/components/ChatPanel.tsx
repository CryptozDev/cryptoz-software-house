import type { ChatDay, ChatMessage } from "../types";

const TYPE_STYLE: Record<string, string> = {
  Discussion: "bg-neutral-700/60 text-neutral-200",
  Proposal: "bg-sky-900/60 text-sky-300",
  Question: "bg-yellow-900/60 text-yellow-300",
  Decision: "bg-emerald-900/60 text-emerald-300",
  "Task Assignment": "bg-blue-900/60 text-blue-300",
  Progress: "bg-cyan-900/60 text-cyan-300",
  "Code Review": "bg-violet-900/60 text-violet-300",
  "Bug Report": "bg-red-900/60 text-red-300",
  "Test Result": "bg-lime-900/60 text-lime-300",
  Approval: "bg-green-900/60 text-green-300",
  Warning: "bg-orange-900/60 text-orange-300",
};

function Message({ m }: { m: ChatMessage }) {
  const badge = TYPE_STYLE[m.type] ?? TYPE_STYLE.Discussion;
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-2.5">
      <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-neutral-500">
        <span className="text-sm leading-none">{m.emoji}</span>
        <span className="font-medium text-neutral-300">{m.agent}</span>
        <span>· {m.role}</span>
        <span>· [{m.time}]</span>
        <span className={`rounded px-1.5 py-0.5 font-medium ${badge}`}>{m.type}</span>
        {m.task && <span className="rounded bg-neutral-800 px-1.5 py-0.5">Task {m.task}</span>}
        {m.status && <span>· Status: {m.status}</span>}
      </div>
      <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-neutral-200">{m.text}</p>
    </div>
  );
}

export default function ChatPanel({ chats }: { chats: ChatDay[] }) {
  const total = chats.reduce((n, d) => n + d.messages.length, 0);
  return (
    <section className="flex min-h-0 flex-col rounded-lg border border-neutral-800 bg-neutral-900/60">
      <h2 className="border-b border-neutral-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
        💬 AI Group Chat ({total})
      </h2>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
        {chats.length === 0 && <p className="text-sm text-neutral-500">ยังไม่มีบทสนทนา — เริ่มด้วย /cryptoz:team</p>}
        {chats.map((day) => (
          <div key={day.day} className="space-y-2">
            <div className="sticky top-0 z-10 text-center">
              <span className="rounded-full bg-neutral-800 px-3 py-0.5 text-[11px] text-neutral-400">📅 {day.day}</span>
            </div>
            {day.messages.map((m, i) => (
              <Message key={`${day.day}-${i}`} m={m} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
