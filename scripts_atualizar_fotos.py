import json
import shutil
from pathlib import Path

# Configurações
BASE_DIR = Path("/home/ubuntu/guiavipbrasil.github.io")
PUBLIC_IMAGES = BASE_DIR / "profile-images"
NOVAS_FOTOS_FEM = Path("/home/ubuntu/novas_fotos/mulher2")
NOVAS_FOTOS_TRANS = Path("/home/ubuntu/novas_fotos/trans")

# Garantir que o diretório de destino existe
PUBLIC_IMAGES.mkdir(parents=True, exist_ok=True)

# Carregar perfis
with open(BASE_DIR / "perfis.json", "r", encoding="utf-8") as f:
    perfis = json.load(f)

# Listar arquivos disponíveis
fotos_fem = sorted([f for f in NOVAS_FOTOS_FEM.iterdir() if f.is_file()])
fotos_trans = sorted([f for f in NOVAS_FOTOS_TRANS.iterdir() if f.is_file()])

print(f"Encontradas {len(fotos_fem)} fotos femininas e {len(fotos_trans)} fotos trans.")

fem_idx = 0
trans_idx = 0

for perfil in perfis:
    pid = perfil["id"]
    categoria = perfil["categoria"]
    
    if categoria == "feminina":
        if fem_idx < len(fotos_fem):
            src = fotos_fem[fem_idx]
            ext = src.suffix
            dest_name = f"profile-{pid}{ext}"
            dest = PUBLIC_IMAGES / dest_name
            shutil.copy2(src, dest)
            # Também copiar para a raiz do projeto (como estava antes para compatibilidade)
            shutil.copy2(src, BASE_DIR / "profile-images" / dest_name)
            fem_idx += 1
            print(f"Atualizado perfil {perfil['nome']} (Feminina) com {src.name}")
    elif categoria == "trans":
        if trans_idx < len(fotos_trans):
            src = fotos_trans[trans_idx]
            ext = src.suffix
            dest_name = f"profile-{pid}{ext}"
            dest = PUBLIC_IMAGES / dest_name
            shutil.copy2(src, dest)
            trans_idx += 1
            print(f"Atualizado perfil {perfil['nome']} (Trans) com {src.name}")

print("Processamento de imagens concluído.")
