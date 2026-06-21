@echo off
set "PYTHON=C:\Users\zengchenxi\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe"
cd /d "%~dp0"
"%PYTHON%" -m http.server 8765 --bind 127.0.0.1
