// Shared Context — อ่าน/สร้าง Shared Memory กลางของทีม (.cryptoz/)
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { cryptozRoot, ensureWorkspace, readIfExists } from "../workspace.js";

const PROJECT_TEMPLATE = `# 📦 Project Memory

## ภาพรวมโปรเจกต์
(สรุปสั้น ๆ ว่าโปรเจกต์นี้คืออะไร ทำไมถึงสร้าง)

## Tech Stack
- (เติมภายหลัง เช่น React · Node.js · MySQL)

## Coding Standards
- (อ้าง CLAUDE.md ของโปรเจกต์ถ้ามี)

## Requirements สำคัญ
- (เติมโดย cryptoz-analyst)
`;

export function registerContextTools(server: McpServer): void {
  server.registerTool(
    "cryptoz_init",
    {
      title: "Shared Memory — สร้าง Workspace",
      description: "สร้างโครง .cryptoz/ ของโปรเจกต์ (project.md, tasks.md, chat/, decisions/) — เรียกก่อนเริ่มงานทีมถ้ายังไม่มี",
      inputSchema: {
        projectName: z.string().optional().describe("ชื่อโปรเจกต์ (ใส่หัวไฟล์ project.md ให้)"),
      },
    },
    async ({ projectName }) => {
      ensureWorkspace();
      const projectFile = path.join(cryptozRoot(), "project.md");
      if (!fs.existsSync(projectFile)) {
        const title = projectName ? `# 📦 ${projectName}\n\n` : "";
        fs.writeFileSync(projectFile, `${title}${PROJECT_TEMPLATE}`, "utf8");
      }
      return {
        content: [{ type: "text", text: "✅ .cryptoz/ พร้อมแล้ว — project.md, tasks.md, chat/, decisions/" }],
      };
    },
  );

  server.registerTool(
    "cryptoz_context",
    {
      title: "Shared Memory — อ่านสรุป",
      description: "สรุป Shared Memory ทั้งหมดของโปรเจกต์: project.md, Task Board และ Decision ล่าสุด — ใช้เพื่อเข้าบริบทก่อนทำงาน",
      inputSchema: {
        maxLines: z.number().optional().describe("จำกัดบรรทัดต่อไฟล์ (default 60)"),
      },
    },
    async ({ maxLines }) => {
      const limit = maxLines ?? 60;
      const clip = (s: string | null) =>
        s === null ? "(ไม่มีไฟล์)" : s.split("\n").slice(0, limit).join("\n") + (s.split("\n").length > limit ? "\n…" : "");

      const parts: string[] = ["## 📦 project.md", clip(readIfExists(path.join(cryptozRoot(), "project.md")))];

      const tasks = readIfExists(path.join(cryptozRoot(), "tasks.md"));
      if (tasks) {
        const counts: Record<string, number> = {};
        for (const m of tasks.matchAll(/\| (Backlog|Working|Review|Testing|Done|Failed|Blocked) \|/g)) {
          counts[m[1]] = (counts[m[1]] ?? 0) + 1;
        }
        const summary = Object.entries(counts).map(([k, v]) => `${k}: ${v}`).join(" · ") || "(ไม่มี task)";
        parts.push(`\n## 📋 Task Board (${summary})`, clip(tasks));
      } else {
        parts.push("\n## 📋 Task Board", "(ไม่มีไฟล์ — ทีมยังไม่เคยเริ่มงาน)");
      }

      try {
        const decisions = fs
          .readdirSync(path.join(cryptozRoot(), "decisions"))
          .filter((f) => f.endsWith(".md"))
          .sort()
          .slice(-3);
        parts.push(`\n## ✅ Decision ล่าสุด (${decisions.length} รายการล่าสุด)`);
        parts.push(decisions.length ? decisions.join("\n") : "(ยังไม่มี)");
      } catch {
        parts.push("\n## ✅ Decision ล่าสุด", "(ยังไม่มี)");
      }

      return { content: [{ type: "text", text: parts.join("\n") }] };
    },
  );
}
