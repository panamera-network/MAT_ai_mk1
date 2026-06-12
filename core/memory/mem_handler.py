# core/memory/mem_handler.py
import os
import sys
from mem0 import Memory
from dotenv import load_dotenv

# 🎯 CARA PAKU MATI 2026: Cari folder utama 'MAT_ai_mk1' secara dinamik tak kira mana fail ni berada mat!
def dapatkan_root_projek():
    current_path = os.path.abspath(os.path.dirname(__file__))
    while True:
        # Kalau jumpa folder MAT_ai_mk1 dlm path, kita kunci kedudukan dia
        if os.path.basename(current_path) == "MAT_ai_mk1" or os.path.exists(os.path.join(current_path, ".env")):
            return current_path
        parent = os.path.dirname(current_path)
        if parent == current_path: # Dah sampai hujung drive (C:\ atau D:\) pun tak jumpa
            return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..')) # Fallback cara lama kau
        current_path = parent

PANGKAL_PROJEK = dapatkan_root_projek()
load_dotenv(os.path.join(PANGKAL_PROJEK, '.env'))

print(f"[DEBUG ENV]: Mem_handler menghalakan pembacaan .env ke -> {os.path.join(PANGKAL_PROJEK, '.env')}")

class MatMemory:
    def __init__(self):
        # Folder untuk simpan data memori dlm PC kau (Lokal)
        db_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "db"))
        
        openai_key = os.getenv("OPENAI_API_KEY", "")
        
        config = {
            "vector_store": {
                "provider": "qdrant",
                "config": {
                    "path": db_path
                }
            },
            "embedder": {
                "provider": "huggingface",
                "config": {
                    "model": "sentence-transformers/all-MiniLM-L6-v2"
                }
            }
        }
        
        # 🔗 LOGIK HYBRID MAT.AI (Kekalkan idea kacak kau mat!)
        if openai_key and not openai_key.startswith("sk-palsu") and "api-key-sebenar" not in openai_key:
            config["llm"] = {
                "provider": "openai",
                "config": {
                    "model": os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                    "api_key": openai_key
                }
            }
            print("[MAT MEMORY]: Menggunakan otak CLOUD (OpenAI) dari .env utama!")
        else:
            config["llm"] = {
                "provider": "ollama",
                "config": {
                    "model": "qwen2.5:7b",  
                    "base_url": "http://127.0.0.1:11434"
                }
            }
            print("[MAT MEMORY]: Menggunakan otak LOKAL (Ollama) sbb API Key tak aktif/palsu.")
            
        self.memory = Memory.from_config(config)

    def simpan_fakta(self, user_input: str, user_id: str = "mat_user"):
        try:
            self.memory.add(user_input, user_id=user_id)
        except Exception as e:
            print(f"⚠️ [Mem0 Error]: Gagal simpan memori -> {e}")

    def pancing_konteks(self, user_id: str = "mat_user") -> str:
        try:
            past_memories = self.memory.get_all(user_id=user_id)
            if past_memories:
                # 🎯 TIPS BONUS: Mem0 data structure pulangkan teks dlm field 'memory' (bukan 'text' dlm sesetengah version)
                # Kita buat fallback check biar kalis crash mat!
                return "\n".join([f"- {m.get('memory', m.get('text', ''))}" for m in past_memories if m])
        except Exception as e:
            print(f"⚠️ [Mem0 Error]: Gagal pancing memori -> {e}")
        return "- Tiada memori direkodkan lagi."

mat_mem = MatMemory()