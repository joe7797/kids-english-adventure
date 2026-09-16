@echo off
chcp 65001 >nul
title 奇奇英语乐园 - 启动中
cls
echo ======================================================
echo          奇奇英语乐园 (Kids English Adventure) 
echo ======================================================
echo 正在启动英语乐园...
echo [提示] 关闭本窗口即可停止本地服务
echo.

:: 打开浏览器访问
start "" "http://localhost:8000"

:: 启动 Python 本地 Web 服务
python -m http.server 8000

if %errorlevel% neq 0 (
    echo.
    echo 未检测到 Python，直接在默认浏览器中打开页面...
    start "" "%~dp0index.html"
)
pause
