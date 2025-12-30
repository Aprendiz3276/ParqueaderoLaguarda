@echo off
cd "c:\Users\crist\OneDrive\Escritorio\APP parqueadero LAguarda"

echo Cambiando repositorio remoto...
git remote set-url origin https://github.com/Aprendiz3276/ParqueaderoLaguarda.git

echo Verificando...
git remote -v

echo.
echo Haciendo push a ParqueaderoLaguarda...
git push -u origin main

echo ✅ Completado!
pause
