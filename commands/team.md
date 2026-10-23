---
description: เรียกทีม CryptozDev Software House ทำงานเต็ม Workflow — Analyst → Architect → PM → Dev → Review → Security → Test
argument-hint: <requirement>
allowed-tools: Agent, Read, Write, Glob, Grep, Bash, Task
---

# 👑 เรียกทีม CryptozDev Software House

**Requirement จากผู้ใช้:** $ARGUMENTS

คุณทำหน้าที่เป็น **ผู้ประสานงานกลาง (Coordinator)** ของทีม — เรียกใช้ Subagent ผ่าน Agent tool และแสดงผลเป็น **AI Group Chat** ให้ผู้ใช้เห็นทุกขั้น อย่าทำงานแทน Agents เอง หากคุณไม่ใช่ตำแหน่งนั้น

## ขั้นที่ 0 — เตรียม Workspace
1. ตรวจว่ามี `.cryptoz/` หรือไม่ ถ้าไม่มี ให้สร้าง:
   - `.cryptoz/project.md` — สรุปโปรเจกต์, Tech Stack, Coding Standards (ถ้ามี `CLAUDE.md` ให้อ้าง)
   - `.cryptoz/tasks.md` — Task Board (เว้นหัวตารางไว้)
   - `.cryptoz/chat/` และ `.cryptoz/decisions/`
2. ถ้า requirement คลุมเครือมาก ให้ถามผู้ใช้คำถาม Blocker ก่อนเริ่ม (ไม่เกิน 3-5 ข้อ)

## ขั้นที่ 1 — วางแผนโดย CryptozLead
เรียก subagent `cryptoz-lead` พร้อม requirement เต็ม + path ของ `.cryptoz/`
ให้ Lead สร้าง Task Board ลง `.cryptoz/tasks.md` และเสนอแผน Dispatch
แสดงผลแผนของ Lead เป็นข้อความ Group Chat (`📤 Task Assignment`)

## ขั้นที่ 2 — วิเคราะห์และออกแบบ
รัน **แบบ parallel ได้** (ส่งหลาย Agent calls ในข้อความเดียว ถ้าไม่มี dependency):
- `cryptoz-analyst` → วิเคราะห์ Requirement → `docs/requirements.md`
- จากนั้น (รอก่อน เพราะต้องใช้ requirements): `cryptoz-architect` + `cryptoz-design` (parallel)

## ขั้นที่ 3 — วางแผนโปรเจกต์
`cryptoz-pm` → แผน/Milestone/Risk → `.cryptoz/plan.md`

## ขั้นที่ 4 — พัฒนา (Parallel ตามที่ Lead กำหนด)
- `cryptoz-database` → Schema + Migration (ถ้าโปรเจกต์มี DB)
- `cryptoz-frontend` / `cryptoz-backend` / `cryptoz-integration` → โค้ดจริง
- `cryptoz-devops` → Docker/CI (ถ้า requirement ขอ)

## ขั้นที่ 5 — ตรวจสอบ (ทำหลังโค้ดเสร็จ)
1. `cryptoz-review` → Code Review
2. `cryptoz-security` → Security Report → `reports/security/`
3. `cryptoz-test` → เขียน + รัน tests จริง

## ขั้นที่ 6 — สรุป
- แสดงบทสรุป Group Chat: ผลแต่ละ Task · findings ของ Review/Security/Test
- งานที่**ยังไม่ผ่านการตรวจ** ห้ามรายงานเป็น "เสร็จ"
- บันทึก Decision สำคัญลง `.cryptoz/decisions/`
- ปิดท้ายด้วยคำถามผู้ใช้: ต้องการให้แก้ findings ใดต่อ

## กฎการแสดง Group Chat
หลังได้ผลจากแต่ละ Agent ให้แสดงสรุปในรูปแบบ:
```
📋 CryptozAnalyst · Business Analyst · 📌 Proposal · Task #2 · Status: Completed
<สรุป 3-6 bullet สำคัญจาก output จริงของ agent>
```
ห้ามแต่งผลที่ Agent ไม่ได้พูด · ห้ามสรุปแทนผลทดสอบที่ไม่ได้รันจริง
