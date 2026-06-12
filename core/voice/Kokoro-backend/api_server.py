# core/voice/kokoro-backend/api_server.py

import os
import sys
import shutil
import threading
import warnings
from openai import OpenAI
from dotenv import load_dotenv

# 🎯 SENYAPKAN HANTU AMARAN: Hubang segala amaran buruk dari Torch/HuggingFace dlm terminal
warnings.filterwarnings("ignore", category=UserWarning)
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)

import pyaudio
import numpy as np
import requests 
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from openwakeword.model import Model
from tts_wrapper import KokoroTTSWrapper

# Sumpat path folder UTAMA (D:\MAT_ai_mk1) secara dinamik supaya kenal folder 'core'
PANGKAL_PROJEK = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
load_dotenv(dotenv_path=os.path.join(PANGKAL_PROJEK, '.env'))
if PANGKAL_PROJEK not in sys.path:
    sys.path.append(PANGKAL_PROJEK)

print(f"📦 [DEBUG PATH]: Python sedang mencari folder core dlm -> {PANGKAL_PROJEK}")

# Inisialisasi pembolehubah global
tts = None
HAS_MEMORY = False

try:
    from core.memory.mem_handler import mat_mem
    HAS_MEMORY = True
    print("🧠 [BRAIN ENGINE]: Sistem Memori Jangka Panjang (mem0) BERJAYA DIKUNCI!")
except ImportError:
    print("⚠️ [BRAIN WARN]: Modul mem0 tak jumpa mat. Berjalan tanpa memori jangka panjang.")

openai_client = OpenAI()

# =====================================================================
# [MAT.AI COMPONENT]: ENJIN TELINGA LINTAH OPENWAKEWORD
# =====================================================================
def jalankan_telinga_lintah_mat_ai():
    print("🎙️  [PYTHON KWS]: Memulai enjin openWakeWord (Kalis Baran)...")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, "kws_models", "hey_jarvisv0.1.onnx")
    
    try:
        oww_model = Model(wakeword_models=[model_path], inference_framework="onnx")
        print(f"✅ [PYTHON KWS]: Model {os.path.basename(model_path)} BERJAYA DI-LOAD secara lokal!")
    except Exception as e:
        with open(os.path.join(base_dir, "kws_error.txt"), "w") as f:
            f.write(f"Crash masa load model baru: {str(e)}")
        return

    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 16000
    CHUNK = 1280  
    
    try:
        audio = pyaudio.PyAudio()
        mic_stream = audio.open(format=FORMAT, channels=CHANNELS, rate=RATE, 
                                input=True, frames_per_buffer=CHUNK)
        print("🔌 [PYTHON KWS]: Mikrofon Windows bersambung NATIVE! Tiada SoX diperlukan.")
    except Exception as e:
        print(f"❌ [PYTHON KWS ERROR]: Gagal buka mic Windows: {e}")
        return

    print("👂 [PYTHON KWS]: Sedia menerima panggilan tuan... Cuba sebut 'Hey Jarvis'!")
    
    while True:
        try:
            audio_data = mic_stream.read(CHUNK, exception_on_overflow=False)
            if not audio_data:
                continue
            audio_frame = np.frombuffer(audio_data, dtype=np.int16)
            
            oww_model.predict(audio_frame)
            
            for wakeword in oww_model.prediction_buffer.keys():
                scores = list(oww_model.prediction_buffer[wakeword])
                
                if scores[-1] > 0.5:  
                    print(f"🔥 [WAKEUP TRIGGERED]: Panggilan dikesan mat! Score: {scores[-1]:.2f}")
                    
                    def hantar_trigger():
                        try:
                            requests.post("http://127.0.0.1:3000/api/wakeup", json={"status": "triggered"}, timeout=0.5)
                        except Exception:
                            pass
                    
                    threading.Thread(target=hantar_trigger, daemon=True).start()
                    
        except Exception:
            pass

# ─── ⚡ FASTAPI LIFESPAN MANAGER (PENGURUS HAYAT MODERN 2026) ───────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    global tts
    print("\n" + "🚀" + "="*58 + "🚀")
    print("   [KOKORO API]: Server successfully ignited via Lifespan 2026!")
    print("   [MAT MEM0]: Core Memory Module (Mem0) status locked.")
    print("   [PYTHON BACKEND]: Sedang menghidupkan enjin Kokoro pada CPU...")
    print("🚀" + "="*58 + "🚀\n")
    
    tts = KokoroTTSWrapper()
    
    t = threading.Thread(target=jalankan_telinga_lintah_mat_ai, daemon=True)
    t.start()
    print("🛸 [MAT.AI LAUNCHER]: Thread telinga lintah berjaya dilepaskan dlm background!")
    
    yield  
    
    print("\n" + "🛑" + "="*58 + "🛑")
    print("   [SHUTDOWN]: Shutting down Kokoro API Server safely...")
    print("   [CLEANUP]: Memori dan database diclean dari RAM & OS.")
    print("🛑" + "="*58 + "🛑\n")

# 🎯 FIX UTAMA: Cantumkan title, version, DAN lifespan dalam SATU inisialisASI tunggal mat!
app = FastAPI(title="MAT.ai Brain & Voice Core API", version="2026.1", lifespan=lifespan)

# ─── 🗂️ PYDANTIC MODELS DEFINITION ───────────────────────────────────
class ChatRequest(BaseModel):
    text: str
    system_prompt: str = "" 
    user_id: str = "tuan_farez"

class TTSRequest(BaseModel):
    text: str
    voice: str = "am_puck"
    speed: float = 1.0

# ─── 💬 1. ENDPOINT CHAT MAT AI + MEMORY SYSTEM ─────────────────────────
@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    trimmed_text = request.text.strip()
    if not trimmed_text:
        raise HTTPException(status_code=400, detail="Mesej kosong mat!")

    konteks_memori = ""
    if HAS_MEMORY:
        try:
            fakta_memori = mat_mem.memory.search(query=trimmed_text, user_id=request.user_id)
            if fakta_memori:
                senarai_fakta = [f["memory"] for f in fakta_memori if "memory" in f]
                konteks_memori = "\n[REKOD MEMORI LAMA TUAN]:\n" + "\n".join(f"- {f}" for f in senarai_fakta)
        except Exception as e:
            print(f"⚠️ [MEM0 SEARCH ERROR]: {str(e)}")

    prompt_asal = request.system_prompt if request.system_prompt else "Kau adalah MAT.ai, pembantu AI yang sempoi."
    arahan_system_gabungan = f"{prompt_asal}\n{konteks_memori}"

    try:
        response = openai_client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
            messages=[
                {"role": "system", "content": arahan_system_gabungan},
                {"role": "user", "content": trimmed_text}
            ],
            temperature=0.7
        )
        
        jawapan_ai = response.choices[0].message.content

        if HAS_MEMORY:
            try:
                mat_mem.memory.add(trimmed_text, user_id=request.user_id)
                mat_mem.memory.add(jawapan_ai, user_id="mat_ai") 
            except Exception as e:
                print(f"⚠️ [MEM0 SAVE ERROR]: {str(e)}")

        return {"ok": True, "text": jawapan_ai}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ─── 🔊 2. ENDPOINT TEXT-TO-SPEECH KOKORO TTS ───────────────────────────
@app.post("/v1/audio/speech")
async def text_to_speech(request: TTSRequest):
    try:
        print(f"🔊 [API RECEIVE]: Terima teks: '{request.text}' | Suara: {request.voice}")
        
        if not request.text.strip():
            raise HTTPException(status_code=400, detail="Teks yang dihantar kosong lah mat.")
            
        segments_data = [ (request.text, [request.voice], None) ]
        
        if tts is None:
            raise HTTPException(status_code=500, detail="Enjin Kokoro belum di-load mat!")

        results, combined_filepath = tts.synthesize(
            segments=segments_data,
            speed=request.speed,
            pitch=1.0,
            output_format='WAV'
        )
        
        if combined_filepath and os.path.exists(combined_filepath):
            target_output = os.path.join(os.path.dirname(os.path.abspath(__file__)), "api_output.wav")
            shutil.copyfile(combined_filepath, target_output)
            return FileResponse(target_output, media_type="audio/wav")
            
        raise HTTPException(status_code=500, detail="Enjin Kokoro gagal pulangkan fail audio mat.")
        
    except HTTPException as http_err:
        raise http_err
    except Exception as e:
        print(f"❌ [API ERROR]: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8880, log_level="info")