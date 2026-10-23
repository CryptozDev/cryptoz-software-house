# 🚀 CryptozDev Software House — Claude Code Plugin

**Multi-Agent Collaboration & AI Group Chat** — ทีม AI 15 ตำแหน่ง ทำงานร่วมกันเหมือน Software House จริง
แต่ละ Agent เป็น **Claude Code Subagent แยก Context จริง** พร้อม System Prompt, Tools และขอบเขตของตัวเอง

## ติดตั้ง / ใช้งาน

**วิธีที่ 1 — ติดตั้งผ่าน Marketplace (แนะนำ)** เมื่อ repo นี้อยู่บน GitHub แล้ว:

```text
/plugin marketplace add CryptozDev/cryptoz-ai-team
/plugin install cryptoz@CryptozDev
```

**วิธีที่ 2 — แบบ dev (directory):**

```bash
claude --plugin-dir "path/to/cryptoz-software-house"
```

หรือเพิ่มโฟลเดอร์ใน env `CLAUDE_CODE_PLUGIN_DIRS` เพื่อโหลดอัตโนมัติทุกเซสชัน

## Slash Commands

| Command | หน้าที่ |
|---------|---------|
| `/cryptoz:team <requirement>` | เรียกทีมเต็ม Workflow: Analyst → Architect → PM → Dev → Review → Security → Test |
| `/cryptoz:analyze <เรื่อง>` | วิเคราะห์ Requirement (User Stories, AC, Edge Cases) |
| `/cryptoz:review [path]` | Code Review (Read-only, จัดระดับ findings) |
| `/cryptoz:security [path]` | Security Audit ตาม OWASP Top 10 → `reports/security/` |
| `/cryptoz:test [scope]` | สร้าง + **รัน** Test Suite (Evidence-Based) |
| `/cryptoz:docs [ชนิด]` | สร้างเอกสารอิงโค้ดจริง |
| `/cryptoz:status` | ดู Task Board, Chat Log, Decision ล่าสุด |
| `/cryptoz:on` | 🟢 เปิด AUTO MODE — ทุก prompt ทำงานผ่านทีมอัตโนมัติ (**persist ข้ามเซสชัน** ผ่าน flag `~/.claude/cryptoz-auto-mode.flag` + hook `UserPromptSubmit`) |
| `/cryptoz:off` | 🔴 ปิด AUTO MODE — กลับไปใช้ทีมเฉพาะเมื่อเรียก `/cryptoz:*` เอง |

## ทีม 15 Agents

| Agent | ตำแหน่ง | Model |
|-------|---------|-------|
| 👑 cryptoz-lead | Tech Lead / Orchestrator | opus |
| 📋 cryptoz-analyst | Business Analyst | sonnet |
| 🏗️ cryptoz-architect | Software Architect | opus |
| 🎨 cryptoz-design | UX/UI Designer | sonnet |
| 💻 cryptoz-frontend | Frontend Engineer | opus |
| ⚙️ cryptoz-backend | Backend Engineer | opus |
| 🗄️ cryptoz-database | Database Engineer | sonnet |
| 🧪 cryptoz-test | QA Engineer | sonnet |
| 🔐 cryptoz-security | AppSec Engineer | opus |
| 🚀 cryptoz-devops | DevOps Engineer | sonnet |
| 🔍 cryptoz-review | Code Reviewer | sonnet |
| 📚 cryptoz-docs | Technical Writer | sonnet |
| 📊 cryptoz-pm | Project Manager | sonnet |
| ⚡ cryptoz-performance | Performance Engineer | sonnet |
| 🔗 cryptoz-integration | Integration Engineer | sonnet |

## Safety System (Hooks)

- **PreToolUse → `hooks/scripts/guard.js`**: บล็อกคำสั่ง destructive ระดับ Engine
  (`rm -rf /`, `git push --force`, `DROP DATABASE`, `shutdown`, format ไดรฟ์ ฯลฯ)
- **PostToolUse → `hooks/scripts/activity-log.js`**: บันทึกกิจกรรมลง `.cryptoz/logs/activity.log`
  (เฉพาะโปรเจกต์ที่มี `.cryptoz/`)

ต้องมี **Node.js 18+** ในเครื่อง (hook scripts เป็น Node)

## MCP Server (Shared Memory Tools)

มาพร้อม plugin — เชื่อมอัตโนมัติผ่าน `.mcp.json` ที่ plugin root (ใน zip มี `dist/` build ไว้แล้ว ไม่ต้อง build ซ้ำ)

| Tool | หน้าที่ |
|------|---------|
| `cryptoz_chat` | บันทึกข้อความ Agent ลง Group Chat `.cryptoz/chat/<วันที่>.md` |
| `cryptoz_task_add` / `cryptoz_task_update` / `cryptoz_tasks_list` | จัดการ Task Board `.cryptoz/tasks.md` (ปฏิเสธ ID ซ้ำ) |
| `cryptoz_decision` | บันทึก Decision Log `.cryptoz/decisions/NNN-<ชื่อเรื่อง>.md` (เลขลำดับอัตโนมัติ) |
| `cryptoz_init` / `cryptoz_context` | สร้างโครง `.cryptoz/` และสรุป Shared Memory ทั้งหมด |

ทดสอบแล้วด้วย smoke test จริง (spawn server → JSON-RPC stdio → เขียนไฟล์): `cd mcp-server && npm test`
ถ้าแก้โค้ด: `cd mcp-server && npm install && npm run build`

## 🖥️ Dashboard (Real-time)

เปิดดูทีมแบบ real-time: Agent Status (15 คน) · AI Group Chat · Task Board · Decision Log — อ่านจาก `.cryptoz/` และอัปเดตอัตโนมัติเมื่อไฟล์เปลี่ยน (fs.watch → Socket.IO)

```bash
# ใน zip มี dist/ build ไว้แล้ว — รันได้เลย (ต้องมี Node 18+)
node dashboard/server/index.mjs --project <path โปรเจกต์ของคุณ>
# เปิดเบราว์เซอร์: http://localhost:5175

# ถ้าแก้โค้ด frontend: cd dashboard && npm install && npm run build && npm test
```

หรือรันผ่าน Docker: `docker compose up dashboard` (mount โปรเจกต์เข้าไปที่ `/project`)

| Panel | แสดง |
|-------|------|
| 👥 AgentSidebar | 15 agents พร้อมสถานะล่าสุด (Idle / Working / Done / Warning ฯลฯ) |
| 💬 ChatPanel | บทสนทนาทั้งหมด แยกวัน ไฮไลต์ตาม Message Type |
| 📋 TaskBoard | ตาราง task + status badge + verification |
| 📜 Decision Log | การตัดสินใจล่าสุดของทีม |

## Shared Memory

```text
.cryptoz/
├── project.md   # Project Memory · tasks.md # Task Board · plan.md # Roadmap
├── chat/        # Group Chat Log
├── decisions/   # Decision Log (ADR)
└── logs/        # Activity Log (จาก Hook)
```

Templates สำหรับเริ่มโปรเจกต์ใหม่อยู่ที่ `templates/` (รวม `CLAUDE.md` template สำหรับคัดลอกไป root โปรเจกต์)

## License

MIT — © Jarukit Lobthaisong (CryptozDev)
