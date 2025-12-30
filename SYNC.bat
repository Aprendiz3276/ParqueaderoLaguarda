@echo off
cd "c:\Users\crist\OneDrive\Escritorio\APP parqueadero LAguarda"

echo ========================================
echo Sincronizando con ParqueaderoLaguarda
echo ========================================
echo.

echo Paso 1: Cambiando repositorio remoto...
git remote set-url origin https://github.com/Aprendiz3276/ParqueaderoLaguarda.git

echo.
echo Paso 2: Verificando cambios...
git status

echo.
echo Paso 3: Haciendo push a ParqueaderoLaguarda...
git push origin main --force

echo.
echo ========================================
echo ✅ ¡Completado!
echo ========================================
echo.
echo Verifica en: https://github.com/Aprendiz3276/ParqueaderoLaguarda
echo.
pause
