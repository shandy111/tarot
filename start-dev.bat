@echo off
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel%==0 (
  node server.js
  goto :end
)

set BUNDLED_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe
if exist "%BUNDLED_NODE%" (
  "%BUNDLED_NODE%" server.js
  goto :end
)

echo 没有找到 Node.js。请安装 Node.js LTS: https://nodejs.org/
echo 安装后重新打开 VSCode，再运行: node server.js

:end
pause
