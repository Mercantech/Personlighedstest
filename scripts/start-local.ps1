$ErrorActionPreference = 'Stop'
Set-Location (Split-Path $PSScriptRoot -Parent)
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  $portableNode = Get-ChildItem -LiteralPath "$env:USERPROFILE/.codex/tools" -Directory -Filter 'node-*-win-x64' -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
  if (-not $portableNode) { throw 'Installér Node.js 22.12 eller nyere, og prøv igen.' }
  $env:Path = $portableNode.FullName + ';' + $env:Path
}
if (-not (Test-Path 'web/node_modules')) {
  & npm.cmd run setup
  if ($LASTEXITCODE -ne 0) { throw 'Afhængighederne kunne ikke installeres.' }
}
Write-Host 'Åbn http://127.0.0.1:5173/ i din browser. Hold dette vindue åbent.'
& npm.cmd run dev
