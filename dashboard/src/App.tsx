import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { Snapshot } from "./types";
import AgentSidebar from "./components/AgentSidebar";
import ChatPanel from "./components/ChatPanel";
import TaskBoard from "./components/TaskBoard";

const EMPTY: Snapshot = {
  hasCryptoz: false,
  project: "",
  agents: [],
  tasks: [],
  chats: [],
  decisions: [],
};

export default function App() {
  const [snap, setSnap] = useState<Snapshot>(EMPTY);
  const [connected, setConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const s = io(window.location.origin);
    setSocket(s);
    s.on("connect", () => setConnected(true));
    s.on("disconnect", () => setConnected(false));
    s.on("snapshot", (data: Snapshot) => setSnap(data));
    s.on("update", (data: Snapshot) => setSnap(data));
    return () => {
      s.close();
      setSocket(null);
    };
  }, []);

  const taskCounts = snap.tasks.reduce<Record<string, number>>((acc, t) => {
    acc[t.status] = (acc[t.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex h-screen flex-col bg-neutral-950 text-neutral-200">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-neutral-800 px-4 py-2.5">
        <h1 className="text-base font-semibold">
          🏢 CryptozDev Software House
          <span className="ml-2 text-xs font-normal text-neutral-500">— Team Dashboard (Real-time)</span>
        </h1>
        <div className="ml-auto flex items-center gap-4 text-xs text-neutral-400">
          {Object.keys(taskCounts).length > 0 && (
            <span>
              {Object.entries(taskCounts).map(([k, v]) => (
                <span key={k} className="ml-2">
                  {k} <b className="text-neutral-200">{v}</b>
                </span>
              ))}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <span className={`inline-block h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-red-500"}`} />
            {connected ? "Connected" : "Disconnected"}
          </span>
        </div>
      </header>

      {!snap.hasCryptoz ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <div className="text-5xl">📭</div>
          <p className="text-lg font-medium">ยังไม่มี .cryptoz/ ในโปรเจกต์นี้</p>
          <p className="max-w-md text-sm text-neutral-500">
            ทีมยังไม่เคยเริ่มงาน — เริ่มด้วย <code className="rounded bg-neutral-800 px-1.5 py-0.5">/cryptoz:team &lt;requirement&gt;</code>{" "}
            แล้ว Dashboard นี้จะอัปเดตแบบ real-time เมื่อทีมบันทึกผล
          </p>
        </div>
      ) : (
        <main className="grid min-h-0 flex-1 grid-cols-[230px_1fr_1fr] gap-3 p-3">
          <AgentSidebar agents={snap.agents} />
          <ChatPanel chats={snap.chats} />
          <div className="flex min-h-0 flex-col gap-3">
            <TaskBoard tasks={snap.tasks} />
            <section className="flex min-h-0 flex-col rounded-lg border border-neutral-800 bg-neutral-900/60">
              <h2 className="border-b border-neutral-800 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                📜 Decision Log ({snap.decisions.length})
              </h2>
              <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto p-3 text-sm">
                {snap.decisions.length === 0 && <li className="text-neutral-500">ยังไม่มีการตัดสินใจที่บันทึกไว้</li>}
                {snap.decisions.map((d) => (
                  <li key={d.file} className="truncate rounded px-2 py-1 hover:bg-neutral-800" title={d.file}>
                    <span className="text-emerald-400">✅</span> {d.title}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      )}

      <footer className="border-t border-neutral-800 px-4 py-1.5 text-[11px] text-neutral-600">
        📂 {snap.project || "—"} · ข้อมูลอ่านจากไฟล์ .cryptoz/ ของโปรเจกต์ (อัปเดตอัตโนมัติเมื่อไฟล์เปลี่ยน)
      </footer>
    </div>
  );
}
