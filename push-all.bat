@echo off
setlocal enabledelayedexpansion

cd "c:\Users\crist\OneDrive\Escritorio\APP parqueadero LAguarda"

REM Cambiar URL
git remote set-url origin https://github.com/Aprendiz3276/ParqueaderoLaguarda.git

REM Verificar estado
echo Verificando cambios locales...
git status

REM Agregar todo
echo Agregando todos los cambios...
git add -A

REM Hacer push forzado
echo Haciendo push con --force...
git push -f origin main

echo.
echo ✅ Completado
pause
