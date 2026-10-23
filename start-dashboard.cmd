@echo off
chcp 65001 >nul
REM ============================================
REM  CryptozDev Software House — Dashboard
REM  ใช้: start-dashboard.cmd [path โปรเจกต์]
REM  ถ้าไม่ใส่ path จะถาม (กด Enter = โฟลเดอร์ปัจจุบัน)
REM  แล้วเปิด http://localhost:5175 ในเบราว์เซอร์
REM ============================================
setlocal
set "SERVER=%~dp0dashboard\server\index.mjs"
if not exist "%SERVER%" (
  echo [x] ไม่พบ %SERVER%
  pause
  exit /b 1
)
set "PROJ=%~1"
if "%PROJ%"=="" set /p "PROJ=Path โปรเจกต์ที่ทีมทำงาน (Enter = %CD%): "
if "%PROJ%"=="" set "PROJ=%CD%"
echo.
echo [i] Project  : %PROJ%
echo [i] Dashboard: http://localhost:5175  (กำลังเปิดเบราว์เซอร์...)
echo [i] ปิดหน้าต่างนี้เพื่อหยุด dashboard
echo.
start "" http://localhost:5175
node "%SERVER%" --project "%PROJ%"
pause
