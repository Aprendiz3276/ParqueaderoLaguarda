@echo off
cd "c:\Users\crist\OneDrive\Escritorio\APP parqueadero LAguarda"
git add api/auth.js api/parking.js api/reservations.js api/users.js package.json VERCEL_ERROR_FIX.md
git commit -m "Fix: Restructurar API para Vercel - rutas en api/ en lugar de backend/"
git push origin main
echo ✅ Push completado
pause
