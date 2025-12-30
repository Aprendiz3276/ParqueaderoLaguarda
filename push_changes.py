#!/usr/bin/env python3
import subprocess
import os
import sys

os.chdir(r"c:\Users\crist\OneDrive\Escritorio\APP parqueadero LAguarda")

try:
    print("📝 Agregando archivos...")
    subprocess.run(["git", "add", "api/auth.js", "api/parking.js", "api/reservations.js",
                   "api/users.js", "api/index.js", "api/vercel.js", "package.json", "vercel.json"], check=True)

    print("💾 Creando commit...")
    subprocess.run(["git", "commit", "-m",
                   "Fix: Vercel - usar api/vercel.js como entrada principal"], check=True)

    print("🚀 Haciendo push...")
    subprocess.run(["git", "push", "origin", "main"], check=True)

    print("✅ ¡Push completado exitosamente!")
    print("\n⏳ Vercel detectará los cambios en ~30 segundos")
    print("🔄 El redeploy comenzará automáticamente")

except subprocess.CalledProcessError as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
