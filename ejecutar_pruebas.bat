@echo off
setlocal
cd /d "%~dp0"

echo =======================================================================
echo   UNSA - CALIDAD DE SOFTWARE - TRABAJO PARCIAL 6: AUTOMATIZACION
echo   Ejecutor automatico de pruebas E2E con Playwright (ISO/IEC/IEEE 29119)
echo =======================================================================
echo.

echo [1/3] Verificando entorno Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no esta instalado o no se encuentra en el PATH.
    pause
    exit /b 1
)

echo [2/3] Ejecutando las 3 pasadas formales (corrida-01, corrida-02, corrida-03)...
call npm run corridas:todas
if %errorlevel% neq 0 (
    echo [ALERTA] Se detectaron observaciones durante la ejecucion.
)

echo.
echo [3/3] Abriendo reporte interactivo Playwright HTML...
call npx playwright show-report playwright-report

echo.
echo =======================================================================
echo   Ejecucion completada. Evidencias guardadas en ./evidencias/
echo =======================================================================
pause
