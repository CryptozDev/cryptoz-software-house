// Decision Log — บันทึกการตัดสินใจสำคัญลง .cryptoz/decisions/NNN-<ชื่อเรื่อง>.md
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import fs from "node:fs";
import path from "node:path";
import { ensureWorkspace, localDate, slug } from "../workspace.js";

function decisionsDir(): string {
  return path.join(process.cwd(), ".cryptoz", "decisions");
}

function nextNumber(): number {
  try {
    const nums = fs
      .readdirSync(decisionsDir())
      .map((f) => parseInt(f.match(/^(\d{3})-/)?.[1] ?? "0", 10))
      .filter((n) => Number.isFinite(n) && n > 0);
    return nums.length ? Math.max(...nums) + 1 : 1;
  } catch {
    return 1;
  }
}

export function registerDecisionLogTools(server: McpServer): void {
  server.registerTool(
    "cryptoz_decision",
    {
      title: "Decision Log",
      description:
        "บันทึกการตัดสินใจสำคัญของทีม (architecture, tech stack, มาตรฐาน, ขอบเขต) ลง .cryptoz/decisions/ — " +
        "ต้องระบุเหตุผลเสมอ และควรระบุ Trade-offs ที่ยอมรับ",
      inputSchema: {
        title: z.string().describe("ชื่อเรื่องการตัดสินใจ เช่น 'ใช้ MySQL เป็นฐานข้อมูลหลัก'"),
        decision: z.string().describe("สิ่งที่ทีมตัดสินใจ"),
        rationale: z.string().describe("เหตุผล — ห้ามว่าง"),
        tradeoffs: z.string().optional().describe("Trade-offs ที่ยอมรับ"),
        agent: z.string().optional().describe("agent ผู้เสนอ/ตัดสิน เช่น cryptoz-architect"),
      },
    },
    async ({ title, decision, rationale, tradeoffs, agent }) => {
      ensureWorkspace();
      const n = nextNumber();
      const file = path.join(decisionsDir(), `${String(n).padStart(3, "0")}-${slug(title)}.md`);
      const body = [
        `# ✅ Decision ${String(n).padStart(3, "0")}: ${title}`,
        "",
        `- **วันที่:** ${localDate()}`,
        agent ? `- **ผู้เสนอ/ตัดสิน:** ${agent}` : null,
        "",
        "## การตัดสินใจ",
        "",
        decision,
        "",
        "## เหตุผล",
        "",
        rationale,
        "",
        tradeoffs ? `## Trade-offs ที่ยอมรับ\n\n${tradeoffs}\n` : "",
      ]
        .filter((s) => s !== null)
        .join("\n");
      fs.writeFileSync(file, body, "utf8");
      return { content: [{ type: "text", text: `✅ บันทึก Decision ${String(n).padStart(3, "0")} → ${path.relative(process.cwd(), file)}` }] };
    },
  );
}
