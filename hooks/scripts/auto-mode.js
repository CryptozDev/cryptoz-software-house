#!/usr/bin/env node
// CryptozDev AUTO MODE — UserPromptSubmit hook
// ถ้าเปิด AUTO MODE อยู่ (มีไฟล์ flag เขียนว่า on) จะแทรกบริบทของทีม CryptozDev
// เข้ากับทุก prompt ของผู้ใช้โดยอัตโนมัติ — persist ข้ามเซสชันจนกว่าจะ /cryptoz:off
// เปิด/ปิด: ไฟล์ flag อยู่ที่ ~/.claude/cryptoz-auto-mode.flag (จัดการโดย /cryptoz:on, /cryptoz:off)
'use strict'
const fs = require('fs')
const path = require('path')

const home = process.env.USERPROFILE || process.env.HOME
const flagPath = path.join(home, '.claude', 'cryptoz-auto-mode.flag')

try {
  if (!fs.existsSync(flagPath)) process.exit(0)
  const state = fs.readFileSync(flagPath, 'utf8').trim().toLowerCase()
  if (state !== 'on') process.exit(0)
} catch (_) {
  process.exit(0) // flag พัง/อ่านไม่ได้ = ถือว่าปิด อย่าทำให้เซสชัน error
}

const banner = [
  '[CryptozDev AUTO MODE 🟢 — เปิดอยู่ ปิดได้ด้วย /cryptoz:off]',
  'ปฏิบัติกับโจทย์ของผู้ใช้ในบทบาท Coordinator ของทีม CryptozDev Software House:',
  '- เริ่มด้วยวิเคราะห์โจทย์ + แผนสั้น ๆ ก่อนลงมือ แล้วเรียกเฉพาะ subagent cryptoz-* ที่จำเป็นผ่าน Agent tool (อย่าทำงานแทนทั้งทีมเอง)',
  '- งานโค้ดต้องผ่าน cryptoz-review และ cryptoz-test (รันเทสต์จริง) ก่อนรายงานว่าเสร็จ — ห้ามแต่งผลทดสอบ',
  '- อัปเดต .cryptoz/: tasks.md (Task Board) · chat/ (Group Chat) · decisions/ (Decision สำคัญพร้อมเหตุผล)',
  '- แสดงผลเป็น AI Group Chat · งานเสี่ยงสูง (deploy, ลบไฟล์, แก้ config ระบบ) ต้องขออนุมัติผู้ใช้ก่อนเสมอ',
  '- ข้อความเล็กน้อย (ทักทาย ถามคำ แก้ typo) ตอบเองได้ ไม่ต้องปลุกทีม',
].join('\n')

console.log(banner)
process.exit(0)
