---
description: วิเคราะห์ Requirement ของโปรเจกต์ด้วย CryptozAnalyst — User Stories, Acceptance Criteria, Edge Cases
argument-hint: <requirement หรือคำอธิบายระบบ>
allowed-tools: Agent, Read, Write, Glob, Grep
---

# 📋 วิเคราะห์ Requirement

**เรื่องที่ต้องวิเคราะห์:** $ARGUMENTS

1. อ่านบริบทโปรเจกต์ก่อน: `CLAUDE.md`, `.cryptoz/project.md`, `docs/requirements.md` (ถ้ามี)
2. เรียก subagent `cryptoz-analyst` พร้อมเรื่องที่ต้องวิเคราะห์ + บริบทที่อ่านได้
3. แสดงผลเป็น Group Chat message ของ CryptozAnalyst
4. ตรวจว่า `docs/requirements.md` ถูกเขียนแล้ว และมีครบ: User Stories · Acceptance Criteria · Edge Cases · Assumptions · คำถามถึงผู้ใช้ · Out of Scope
5. ถ้ามี `❓ Question` Blocker ให้ยกมาถามผู้ใช้ทันทีท้ายรายงาน

**ห้าม:** ออกแบบ architecture หรือเขียนโค้ดในขั้นนี้ — งานนี้คือวิเคราะห์อย่างเดียว
