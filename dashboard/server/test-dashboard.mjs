// Dashboard smoke test — สร้าง fixture .cryptoz/ ชั่วคราว → start server → ตรวจ /api/health และหน้าเว็บ
import { spawn } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cwd = mkdtempSync(join(tmpdir(), "cryptoz-dash-"));
const cryptoz = join(cwd, ".cryptoz");
mkdirSync(join(cryptoz, "chat"), { recursive: true });
mkdirSync(join(cryptoz, "decisions"), { recursive: true });
writeFileSync(join(cryptoz, "tasks.md"), `# 📋 CryptozDev Task Board

| Task ID | Assigned Agent | Description | Dependencies | Acceptance Criteria | Status | Output Artifacts | Verification Result |
|---------|----------------|-------------|--------------|---------------------|--------|------------------|---------------------|
| #1 | cryptoz-database | ออกแบบ Schema | - | migration รันผ่าน | Done | migrations/001.sql | npm test — 5 passed |
`);
writeFileSync(join(cryptoz, "chat", "2026-10-23.md"), `# 💬 CryptozDev Group Chat — 2026-10-23

### 👑 cryptoz-lead · Tech Lead · [10:00] · Task Assignment · Task #1 · Status: Working

มอบหมายให้ Database ออกแบบ Schema ก่อน

### 🗄️ cryptoz-database · DBA · [10:15] · Test Result · Task #1 · Status: Completed

Migration รันผ่าน 5/5 cases
`);
writeFileSync(join(cryptoz, "decisions", "001-use-mysql.md"), `# ✅ Decision 001: ใช้ MySQL\n`);

const serverPath = fileURLToPath(new URL("./index.mjs", import.meta.url));
const proc = spawn(process.execPath, [serverPath, "--project", cwd], {
  env: { ...process.env, PORT: "5199" },
  stdio: ["ignore", "pipe", "pipe"],
});
proc.stdout.on("data", (c) => process.stdout.write(`[server] ${c}`));
proc.stderr.on("data", (c) => process.stderr.write(`[server] ${c}`));

let failed = 0;
const check = (name, cond, detail = "") => {
  console.log(`${cond ? "✅" : "❌"} ${name}${cond || !detail ? "" : ` — ${detail}`}`);
  if (!cond) failed++;
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await wait(1200);

try {
  const health = await fetch("http://127.0.0.1:5199/api/health").then((r) => r.json());
  check("health: hasCryptoz", health.hasCryptoz === true);
  check("health: project path", health.project === cwd);
  check("health: tasks parse ได้ 1 แถว", health.tasks?.length === 1, JSON.stringify(health.tasks));
  check("health: task #1 Done", health.tasks?.[0]?.status === "Done");
  check("health: chat parse ได้ 2 ข้อความ", health.chats?.[0]?.messages?.length === 2, JSON.stringify(health.chats));
  const msg = health.chats?.[0]?.messages?.[0];
  check("health: header parse ถูก", msg?.agent === "cryptoz-lead" && msg?.type === "Task Assignment" && msg?.task === "#1", JSON.stringify(msg));
  check("health: decisions 1 รายการ", health.decisions?.length === 1);
  check("health: agents ครบ 15", health.agents?.length === 15);
  const lead = health.agents?.find((a) => a.id === "cryptoz-lead");
  check("health: lead มี activity", lead?.lastType === "Task Assignment", JSON.stringify(lead));

  // real-time: เขียนไฟล์เพิ่ม → health ต้องเห็น (watcher ทำงาน)
  writeFileSync(join(cryptoz, "chat", "2026-10-23.md"),
    readFileSync(join(cryptoz, "chat", "2026-10-23.md"), "utf8") + "\n\n### 🔐 cryptoz-security · AppSec · [11:00] · Warning\n\nพบช่องโหว่\n");
  await wait(800);
  const after = await fetch("http://127.0.0.1:5199/api/health").then((r) => r.json());
  check("real-time: ข้อความใหม่ถูกอ่าน", after.chats?.[0]?.messages?.length === 3);

  const html = await fetch("http://127.0.0.1:5199/").then((r) => r.text());
  check("หน้าเว็บ serve ได้", html.includes('id="root"'));
} catch (err) {
  check("unexpected error", false, String(err));
} finally {
  proc.kill();
  await wait(300);
  try { rmSync(cwd, { recursive: true, force: true }); } catch {}
}

console.log(failed === 0 ? "\n🎉 DASHBOARD TEST PASSED" : `\n💥 ${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
