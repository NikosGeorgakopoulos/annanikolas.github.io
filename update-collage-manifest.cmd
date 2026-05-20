@echo off
setlocal
set "SCRIPT_DIR=%~dp0"
node "%SCRIPT_DIR%local-scripts\update-collage-manifest.mjs"
endlocal
