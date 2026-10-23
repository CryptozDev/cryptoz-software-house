---
description: รีวิวโค้ดด้วย CryptozReview — SOLID, correctness, consistency (Read-only)
argument-hint: [path หรือเว้นว่างเพื่อรีวิวการเปลี่ยนแปลงล่าสุด]
allowed-tools: Agent, Read, Glob, Grep, Bash
---

# 🔍 Code Review

**ขอบเขตที่ต้องรีวิว:** $ARGUMENTS (ถ้าว่าง → รีวิว uncommitted changes จาก `git diff` ถ้าเป็น git repo หรือไฟล์ที่แก้ล่าสุด)

1. ระบุรายการไฟล์ที่อยู่ในขอบเขตให้ชัดก่อนเริ่ม
2. เรียก subagent `cryptoz-review` พร้อมรายชื่อไฟล์และบริบท (โปรเจกต์นี้ใช้ convention อะไร)
3. แสดงผลเป็น Group Chat: findings จัดระดับ 🔴 Blocker / 🟠 Should fix / 🟡 Nice to have
   ทุก finding ต้องมี `ไฟล์:บรรทัด` อ้างจริง
4. สรุปคำตัดสิน: **Approve / Request changes** พร้อมจำนวนไฟล์ที่อ่านจริง
5. เสนอต่อผู้ใช้: ให้มอบหมายการแก้ให้ cryptoz-frontend / cryptoz-backend หรือไม่

**ห้าม:** แก้โค้ดในขั้นนี้ — Review เป็น Read-only ตามสเปก
