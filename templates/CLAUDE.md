# CLAUDE.md — Shared Context กลางของทีม CryptozDev Software House

> คัดลอกไฟล์นี้ไปไว้ที่ root ของโปรเจกต์ (หรือรวมเนื้อหาเข้ากับ CLAUDE.md ที่มีอยู่)
> เพื่อให้ Agents ทุกตำแหน่งทำงานบนบริบทเดียวกัน

## ทีม Cryptoz
โปรเจกต์นี้ทำงานร่วมกับทีม AI 15 ตำแหน่ง (plugin: cryptoz)
- Orchestrator คือ **CryptozLead** — เริ่มงานด้วย `/cryptoz:team <requirement>`
- Task Board อยู่ที่ `.cryptoz/tasks.md` · Decision ที่ `.cryptoz/decisions/`
- Security reports อยู่ที่ `reports/security/`

## กฎการทำงานร่วมกัน (บังคับทุก Agent)
1. อ่าน `.cryptoz/project.md` ก่อนทำงานเสมอ — งานต้องสอดคล้องกับบริบทที่บันทึกไว้
2. **ห้ามแต่งผลการทดสอบ** — ต้องรันจริงและอ้าง output จริง
3. **ห้ามรายงานว่างานเสร็จ** หากยังไม่ผ่านการตรวจ (build/test/review)
4. ระบุ Assumptions ทุกตัวที่คิดเอง และรายงาน Error อย่างตรงไปตรงมา
5. งานเสี่ยงสูง (deploy production, ลบข้อมูล, แก้ infra จริง) ต้องขออนุมัติผู้ใช้ก่อนเสมอ
6. ทุก output ใช้ Group Chat header: `<emoji> ชื่อ · ตำแหน่ง · <ประเภทข้อความ> · Task: <id> · Status: <...>`

## หลักการพัฒนา
Clean Architecture · SOLID · DRY · KISS · Separation of Concerns · Modular · Type Safety · Secure by Default · Testable · Observable

> เริ่มจาก MVP ที่ใช้งานได้จริง — หลีกเลี่ยง Overengineering

## โครงสร้าง .cryptoz/
```text
.cryptoz/
├── project.md      # Project Memory (อ่านก่อนทำงานเสมอ)
├── tasks.md        # Task Board
├── plan.md         # Roadmap / Milestones
├── chat/           # Group Chat Log
├── decisions/      # Decision Log (ADR)
└── logs/           # Activity log (เขียนโดย Hook)
```
