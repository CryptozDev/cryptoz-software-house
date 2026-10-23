// Group Chat Log — บันทึกข้อความของ Agent ลง .cryptoz/chat/<วันที่>.md
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { ensureWorkspace, localDate, nowHM, safeCell } from "../workspace.js";

const MESSAGE_TYPES = [
  "Discussion", "Proposal", "Question", "Decision", "Task Assignment",
  "Progress", "Code Review", "Bug Report", "Test Result", "Approval", "Warning",
] as const;

const EMOJI: Record<(typeof MESSAGE_TYPES)[number], string> = {
  "Discussion": "💬", "Proposal": "📌", "Question": "❓", "Decision": "✅",
  "Task Assignment": "📤", "Progress": "📈", "Code Review": "🔍", "Bug Report": "🐛",
  "Test Result": "🧪", "Approval": "👍", "Warning": "⚠️",
};

export function registerGroupChatTools(server: McpServer): void {
  server.registerTool(
    "cryptoz_chat",
    {
      title: "Group Chat Log",
      description:
        "บันทึกข้อความของ Agent ลง AI Group Chat (.cryptoz/chat/<วันที่>.md) — " +
        "ทุกข้อความระบุ Agent, Role, Message Type และอ้าง Task ที่เกี่ยวข้องถ้ามี",
      inputSchema: {
        agent: z.string().describe("ชื่อ agent เช่น cryptoz-lead"),
        role: z.string().describe("ตำแหน่ง เช่น Tech Lead / Orchestrator"),
        type: z.enum(MESSAGE_TYPES).describe("ชนิดข้อความตาม protocol ของทีม"),
        message: z.string().describe("เนื้อหาข้อความ (กระชับ 1-5 บรรทัด)"),
        task: z.string().optional().describe("Task ID ที่เกี่ยวข้อง เช่น #1"),
        status: z.string().optional().describe("สถานะ เช่น Working / Completed"),
      },
    },
    async ({ agent, role, type, message, task, status }) => {
      ensureWorkspace();
      const header =
        `${EMOJI[type]} ${safeCell(agent)} · ${safeCell(role)} · [${nowHM()}] · ${type}` +
        (task ? ` · Task ${safeCell(task)}` : "") +
        (status ? ` · Status: ${safeCell(status)}` : "");
      const file = path.join(process.cwd(), ".cryptoz", "chat", `${localDate()}.md`);
      fs.appendFileSync(file, `\n\n### ${header}\n\n${message.trim()}\n`, "utf8");
      return {
        content: [{ type: "text", text: `✅ บันทึกลง ${path.relative(process.cwd(), file)} แล้ว` }],
      };
    },
  );
}
