// Smoke test — spawn server จริง คุยผ่าน stdio JSON-RPC แล้วตรวจว่า tools เขียนไฟล์ .cryptoz/ ได้จริง
import { spawn } from "node:child_process";
import { mkdtempSync, existsSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const serverPath = fileURLToPath(new URL("../dist/index.js", import.meta.url));
const cwd = mkdtempSync(join(tmpdir(), "cryptoz-smoke-"));

const proc = spawn(process.execPath, [serverPath], { cwd, stdio: ["pipe", "pipe", "pipe"] });
let buf = "";
const pending = new Map();
let nextId = 1;

proc.stdout.on("data", (chunk) => {
  buf += chunk.toString();
  let idx;
  while ((idx = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, idx).trim();
    buf = buf.slice(idx + 1);
    if (!line) continue;
    const msg = JSON.parse(line);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
  }
});
proc.stderr.on("data", (c) => process.stderr.write(`[server] ${c}`));

function rpc(method, params) {
  const id = nextId++;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`timeout: ${method}`)), 10000);
    pending.set(id, (msg) => {
      clearTimeout(timer);
      resolve(msg);
    });
    proc.stdin.write(JSON.stringify({ jsonrpc: "2.0", id, method, params }) + "\n");
  });
}

function textOf(res) {
  return res.result?.content?.map((c) => c.text).join("\n") ?? "";
}

let failed = 0;
function check(name, cond, detail = "") {
  console.log(`${cond ? "✅" : "❌"} ${name}${cond || !detail ? "" : ` — ${detail}`}`);
  if (!cond) failed++;
}

try {
  const init = await rpc("initialize", {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: { name: "smoke", version: "0" },
  });
  check("initialize", init.result?.serverInfo?.name === "cryptoz", JSON.stringify(init.result?.serverInfo));
  proc.stdin.write(JSON.stringify({ jsonrpc: "2.0", method: "notifications/initialized" }) + "\n");

  const list = await rpc("tools/list", {});
  const names = (list.result?.tools ?? []).map((t) => t.name);
  for (const t of ["cryptoz_chat", "cryptoz_task_add", "cryptoz_task_update", "cryptoz_tasks_list", "cryptoz_decision", "cryptoz_init", "cryptoz_context"]) {
    check(`tools/list มี ${t}`, names.includes(t));
  }

  await rpc("tools/call", { name: "cryptoz_init", arguments: { projectName: "Smoke Hotel" } });
  check("cryptoz_init สร้าง .cryptoz/", existsSync(join(cwd, ".cryptoz", "project.md")));

  const chat = await rpc("tools/call", {
    name: "cryptoz_chat",
    arguments: { agent: "cryptoz-lead", role: "Tech Lead", type: "Task Assignment", message: "ทำ Schema", task: "#1", status: "Working" },
  });
  const chatFiles = existsSync(join(cwd, ".cryptoz", "chat")) ? readdirSync(join(cwd, ".cryptoz", "chat")) : [];
  check("cryptoz_chat เขียนไฟล์ chat", chatFiles.length === 1 && textOf(chat).includes("✅"), textOf(chat));

  const add = await rpc("tools/call", {
    name: "cryptoz_task_add",
    arguments: { id: "#1", agent: "cryptoz-database", description: "ออกแบบ Schema", criteria: "มี migration รันผ่าน" },
  });
  check("cryptoz_task_add", textOf(add).includes("✅"), textOf(add));

  const dup = await rpc("tools/call", {
    name: "cryptoz_task_add",
    arguments: { id: "#1", agent: "x", description: "ซ้ำ", criteria: "-" },
  });
  check("task ID ซ้ำถูกปฏิเสธ", dup.result?.isError === true);

  const upd = await rpc("tools/call", {
    name: "cryptoz_task_update",
    arguments: { id: "#1", status: "Done", verification: "npm test — 5 passed" },
  });
  check("cryptoz_task_update", textOf(upd).includes("Done"), textOf(upd));

  const dec = await rpc("tools/call", {
    name: "cryptoz_decision",
    arguments: { title: "Use MySQL", decision: "ใช้ MySQL 8", rationale: "ทีมคุ้นเคย + ฟรี", tradeoffs: "ต้องดู concurrent booking", agent: "cryptoz-architect" },
  });
  check("cryptoz_decision", textOf(dec).includes("001"), textOf(dec));

  const ctx = await rpc("tools/call", { name: "cryptoz_context", arguments: {} });
  check("cryptoz_context เห็นภาพรวม", textOf(ctx).includes("Task Board") && textOf(ctx).includes("Smoke Hotel"), textOf(ctx).slice(0, 120));

  const tasksMd = readFileSync(join(cwd, ".cryptoz", "tasks.md"), "utf8");
  check("tasks.md มีแถว #1 Done", tasksMd.includes("| #1 |") && tasksMd.includes("| Done |"));
} catch (err) {
  check("unexpected error", false, String(err));
} finally {
  proc.kill();
  try { rmSync(cwd, { recursive: true, force: true }); } catch {}
}

console.log(failed === 0 ? "\n🎉 SMOKE TEST PASSED" : `\n💥 ${failed} CHECK(S) FAILED`);
process.exit(failed === 0 ? 0 : 1);
