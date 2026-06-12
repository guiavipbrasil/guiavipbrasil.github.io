import json
import os
from pathlib import Path

# Configurações
BASE_DIR = Path("/home/ubuntu/guiavipbrasil.github.io")
PUBLIC_IMAGES = BASE_DIR / "profile-images"

# Listar arquivos na pasta de imagens para mapear id -> extensão
arquivos_reais = list(PUBLIC_IMAGES.glob("profile-*.*"))
mapeamento_ext = {}
for f in arquivos_reais:
    nome = f.stem
    if nome.startswith("profile-"):
        try:
            pid = int(nome.split("-")[1])
            ext = f.suffix
            if ext.lower() in [".jpeg", ".jpg", ".webp", ".png"]:
                mapeamento_ext[pid] = ext
        except:
            continue

# Criar um arquivo TS com o mapeamento para o frontend
mapping_ts = "export const profileExtensions: Record<number, string> = " + json.dumps(mapeamento_ext) + ";"
with open(BASE_DIR / "client/src/profileExtensions.ts", "w", encoding="utf-8") as f:
    f.write(mapping_ts)

print(f"Mapeamento gerado: {len(mapeamento_ext)} perfis.")
