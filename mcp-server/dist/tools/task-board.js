import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { ensureWorkspace, safeCell, readIfExists } from "../workspace.js";
const STATUSES = ["Backlog", "Working", "Review", "Testing", "Done", "Failed", "Blocked"];
const HEADER = [
    "# 📋 CryptozDev Task Board",
    "",
    "| Task ID | Assigned Agent | Description | Dependencies | Acceptance Criteria | Status | Output Artifacts | Verification Result |",
    "|---------|----------------|-------------|--------------|---------------------|--------|------------------|---------------------|",
].join("\n");
function tasksFile() {
    return path.join(process.cwd(), ".cryptoz", "tasks.md");
}
function findRow(content, id) {
    const needle = `| ${id} |`;
    for (const line of content.split("\n")) {
        if (line.startsWith(needle))
            return line;
    }
    return null;
}
export function registerTaskBoardTools(server) {
    server.registerTool("cryptoz_task_add", {
        title: "Task Board — เพิ่ม Task",
        description: "เพิ่ม task ใหม่ลง .cryptoz/tasks.md — ทุก task ต้องมี ID, Agent เจ้าของ, Description, Acceptance Criteria",
        inputSchema: {
            id: z.string().describe("Task ID เช่น #1 หรือ T1 (ต้องไม่ซ้ำ)"),
            agent: z.string().describe("agent เจ้าของงาน เช่น cryptoz-frontend"),
            description: z.string().describe("สิ่งที่ต้องทำ"),
            dependencies: z.string().optional().describe("task อื่นที่ต้องเสร็จก่อน เช่น #1, #2 (เว้นว่างถ้าไม่มี)"),
            criteria: z.string().describe("Acceptance Criteria — จะรู้ได้อย่างไรว่าเสร็จจริง"),
        },
    }, async ({ id, agent, description, dependencies, criteria }) => {
        ensureWorkspace();
        const file = tasksFile();
        let content = readIfExists(file) ?? HEADER;
        if (findRow(content, id)) {
            return { content: [{ type: "text", text: `❌ Task ID "${id}" มีอยู่แล้ว — ใช้ cryptoz_task_update แทน` }], isError: true };
        }
        const row = `| ${safeCell(id)} | ${safeCell(agent)} | ${safeCell(description)} | ${safeCell(dependencies ?? "-")} | ${safeCell(criteria)} | Backlog | - | - |`;
        if (!content.startsWith("# 📋 CryptozDev Task Board"))
            content = `${HEADER}\n${content}`;
        fs.writeFileSync(file, `${content.replace(/\s*$/, "")}\n${row}\n`, "utf8");
        return { content: [{ type: "text", text: `✅ เพิ่ม ${id} (Backlog) — เจ้าของ: ${agent}` }] };
    });
    server.registerTool("cryptoz_task_update", {
        title: "Task Board — อัปเดตสถานะ",
        description: "อัปเดตสถานะ/ผลลัพธ์/การตรวจสอบของ task — ห้ามตั้ง Done เว้นแต่ตรวจสอบด้วยหลักฐานจริงแล้ว",
        inputSchema: {
            id: z.string().describe("Task ID ที่มีอยู่"),
            status: z.enum(STATUSES).optional().describe("สถานะใหม่"),
            artifacts: z.string().optional().describe("ไฟล์/ผลลัพธ์ที่ได้ เช่น src/api/auth.ts, reports/…"),
            verification: z.string().optional().describe("หลักฐานการตรวจสอบจริง เช่น 'npm test — 24 passed (output จริง)'"),
        },
    }, async ({ id, status, artifacts, verification }) => {
        const file = tasksFile();
        const content = readIfExists(file);
        if (!content) {
            return { content: [{ type: "text", text: "❌ ยังไม่มี .cryptoz/tasks.md — เพิ่ม task ก่อนด้วย cryptoz_task_add" }], isError: true };
        }
        const row = findRow(content, id);
        if (!row) {
            return { content: [{ type: "text", text: `❌ ไม่พบ Task ID "${id}"` }], isError: true };
        }
        const cells = row.split("|").slice(1, -1).map((c) => c.trim());
        if (status)
            cells[5] = status;
        if (artifacts)
            cells[6] = safeCell(artifacts);
        if (verification)
            cells[7] = safeCell(verification);
        const newRow = `| ${cells.join(" | ")} |`;
        const updated = content.split("\n").map((l) => (l === row ? newRow : l)).join("\n");
        fs.writeFileSync(file, updated, "utf8");
        return { content: [{ type: "text", text: `✅ อัปเดต ${id} → ${cells[5]}${verification ? ` (ตรวจแล้ว: ${verification})` : ""}` }] };
    });
    server.registerTool("cryptoz_tasks_list", {
        title: "Task Board — อ่านทั้งหมด",
        description: "อ่าน Task Board เต็ม (.cryptoz/tasks.md) — ใช้ตอน /cryptoz:status หรือก่อนมอบหมายงาน",
        inputSchema: {},
    }, async () => {
        const content = readIfExists(tasksFile());
        return {
            content: [{ type: "text", text: content ?? "ยังไม่มี .cryptoz/tasks.md — ทีมยังไม่เคยเริ่มงานในโปรเจกต์นี้" }],
        };
    });
}
