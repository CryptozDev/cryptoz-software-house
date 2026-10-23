// CryptozDev Software House — Dashboard Server
// อ่านไฟล์ .cryptoz/ ของโปรเจกต์ แล้ว push ข้อมูล real-time ผ่าน Socket.IO
// ใช้งาน: node server/index.mjs --project <path โปรเจกต์>   (default: CRYPTOZ_PROJECT env หรือ cwd)
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// ── config ──────────────────────────────────────────────
const args = process.argv.slice(2);
const projIdx = args.indexOf("--project");
const project = path.resolve(
  projIdx >= 0 ? args[projIdx + 1] : (process.env.CRYPTOZ_PROJECT || process.cwd()),
);
const cryptoz = path.join(project, ".cryptoz");
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
const PORT = Number(process.env.PORT || 5175);

const ROSTER = [
  ["cryptoz-lead", "👑", "CryptozLead", "Tech Lead / Orchestrator"],
  ["cryptoz-analyst", "📋", "CryptozAnalyst", "Business Analyst"],
  ["cryptoz-architect", "🏗️", "CryptozArchitect", "Software Architect"],
  ["cryptoz-design", "🎨", "CryptozDesign", "UX/UI Designer"],
  ["cryptoz-frontend", "💻", "CryptozFrontend", "Frontend Engineer"],
  ["cryptoz-backend", "⚙️", "CryptozBackend", "Backend Engineer"],
  ["cryptoz-database", "🗄️", "CryptozDatabase", "Database Engineer"],
  ["cryptoz-test", "🧪", "CryptozTest", "QA Engineer"],
  ["cryptoz-security", "🔐", "CryptozSecurity", "AppSec Engineer"],
  ["cryptoz-devops", "🚀", "CryptozDevOps", "DevOps Engineer"],
  ["cryptoz-review", "🔍", "CryptozReview", "Code Reviewer"],
  ["cryptoz-docs", "📚", "CryptozDocs", "Technical Writer"],
  ["cryptoz-pm", "📊", "CryptozPM", "Project Manager"],
  ["cryptoz-performance", "⚡", "CryptozPerformance", "Performance Engineer"],
  ["cryptoz-integration", "🔗", "CryptozIntegration", "Integration Engineer"],
];

// ── parsers: ไฟล์ markdown → JSON ────────────────────────
function parseTasks() {
  const file = path.join(cryptoz, "tasks.md");
  if (!fs.existsSync(file)) return [];
  const rows = fs.readFileSync(file, "utf8")
    .split("\n")
    .filter((l) => l.startsWith("|") && !l.includes("---") && !l.includes("Task ID"));
  return rows.map((l) => {
    const c = l.split("|").slice(1, -1).map((s) => s.trim());
    return {
      id: c[0] ?? "", agent: c[1] ?? "", description: c[2] ?? "", dependencies: c[3] ?? "",
      criteria: c[4] ?? "", status: c[5] ?? "Backlog", artifacts: c[6] ?? "", verification: c[7] ?? "",
    };
  });
}

function parseChats() {
  const dir = path.join(cryptoz, "chat");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort().map((day) => {
    const raw = fs.readFileSync(path.join(dir, day), "utf8");
    const messages = [];
    for (const block of raw.split(/^###\s+/m).slice(1)) {
      const [header, ...rest] = block.split("\n");
      const parts = header.split("·").map((s) => s.trim());
      const who = parts[0] ?? "";
      // หา chip Task จากท้ายกลับมา — กันชนกับ Message Type เช่น "Task Assignment"
      const task = ([...parts].reverse().find((p) => p.startsWith("Task ")) ?? "").replace(/^Task\s*/, "") || undefined;
      const status = (parts.find((p) => p.startsWith("Status:")) ?? "").replace(/^Status:\s*/, "") || undefined;
      messages.push({
        emoji: (who.match(/^\S+/) ?? [""])[0],
        agent: who.replace(/^\S+\s*/, ""),
        role: parts[1] ?? "",
        time: (parts[2] ?? "").replace(/[[\]]/g, ""),
        type: parts[3] ?? "Discussion",
        task,
        status,
        text: rest.join("\n").trim(),
      });
    }
    return { day: day.replace(/\.md$/, ""), messages };
  });
}

function readDecisions() {
  const dir = path.join(cryptoz, "decisions");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort().reverse().map((f) => {
    const first = (fs.readFileSync(path.join(dir, f), "utf8").split("\n")[0] ?? "").replace(/^#\s*/, "");
    return { file: f, title: first };
  });
}

function snapshot() {
  const chats = parseChats();
  const lastByAgent = new Map();
  for (const day of chats) {
    for (const m of day.messages) {
      const key = m.agent.toLowerCase().replace(/^cryptoz/, "cryptoz");
      if (!lastByAgent.has(key)) lastByAgent.set(key, m);
    }
  }
  const agents = ROSTER.map(([id, emoji, name, title]) => {
    const m = lastByAgent.get(id) ?? lastByAgent.get(name.toLowerCase());
    return {
      id, emoji, name, title,
      lastType: m?.type, lastTime: m?.time, lastStatus: m?.status,
    };
  });
  return { hasCryptoz: fs.existsSync(cryptoz), project, agents, tasks: parseTasks(), chats, decisions: readDecisions() };
}

// ── HTTP + Socket.IO ────────────────────────────────────
const app = express();
const http = createServer(app);
const io = new Server(http, { cors: { origin: "*" } });

app.get("/api/health", (_req, res) => res.json(snapshot()));
app.use(express.static(dist));
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));

io.on("connection", (socket) => socket.emit("snapshot", snapshot()));

// watch .cryptoz/ — ถ้ายังไม่มีโฟลเดอร์ ให้รอแล้ว attach อัตโนมัติเมื่อถูกสร้าง
let watcher = null;
let debounce = null;
function pushUpdate() {
  clearTimeout(debounce);
  debounce = setTimeout(() => io.emit("update", snapshot()), 250);
}
function attachWatcher() {
  if (watcher || !fs.existsSync(cryptoz)) return;
  watcher = fs.watch(cryptoz, { recursive: true }, pushUpdate);
  pushUpdate();
  console.log("[cryptoz-dashboard] watching .cryptoz/");
}
attachWatcher();
setInterval(attachWatcher, 3000);

http.listen(PORT, () => {
  console.log(`[cryptoz-dashboard] listening on http://localhost:${PORT}`);
  console.log(`[cryptoz-dashboard] project: ${project}`);
});
