$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundledNode = "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

Set-Location $projectRoot

if (Get-Command node -ErrorAction SilentlyContinue) {
  node server.js
  exit
}

if (Test-Path $bundledNode) {
  & $bundledNode server.js
  exit
}

Write-Host "没有找到 Node.js。请安装 Node.js LTS：https://nodejs.org/" -ForegroundColor Red
Write-Host "安装后重新打开 VSCode，再运行：node server.js" -ForegroundColor Yellow
