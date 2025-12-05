from pathlib import Path
import yt_dlp as ytdl
from moviepy import VideoFileClip
import ffmpeg
from faster_whisper import WhisperModel
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
import os
from db import SessionLocal, Summary

DOWNLOAD_DIR = os.environ.get("DOWNLOAD_DIR", "downloads")

def download_video(url: str, out_dir: str = DOWNLOAD_DIR) -> Path:
    Path(out_dir).mkdir(parents=True, exist_ok=True)
    ydl_opts = {
        'outtmpl': f'{out_dir}/%(title)s.%(ext)s',
        'format': 'bestvideo+bestaudio/best',
        'noplaylist': True,
        'quiet': True,
    }
    with ytdl.YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(url, download=True)
        return Path(ydl.prepare_filename(info))


def extract_audio_to_wav(video_path: Path, sr: int = 16000) -> Path:
    video_path = Path(video_path)
    out_wav = video_path.with_suffix('.wav')
    
    clip = VideoFileClip(str(video_path))
    tmp_audio = video_path.with_suffix('.temp_audio.wav')
    clip.audio.write_audiofile(str(tmp_audio), fps=sr)
    clip.close()

    print(f"ffmpeg module: {ffmpeg}")
    print(f"ffmpeg dir: {dir(ffmpeg)[:10]}")  # первые 10 атрибутов
    stream = ffmpeg.input(str(tmp_audio))
    stream = ffmpeg.output(stream, str(out_wav), ac=1, ar=sr)
    ffmpeg.run(stream, overwrite_output=True, quiet=True)
    
    try:
        os.remove(tmp_audio)
    except:
        pass
    
    return out_wav

def transcribe_audio_wisper(audio_path: Path, model_size: str = 'small', language: str = 'ru') -> str:
    model = WhisperModel(model_size, device='cpu', compute_type='float32')
    segments, _ = model.transcribe(str(audio_path), beam_size=5, language=language)
    return ' '.join(segment.text for segment in segments)


def summarize_text(text):
    tokenizer = AutoTokenizer.from_pretrained("LaciaStudio/Lacia_sum_small_v1")
    model = AutoModelForSeq2SeqLM.from_pretrained("LaciaStudio/Lacia_sum_small_v1")
    
    inputs = tokenizer("summarize: " + text, return_tensors="pt", max_length=512, truncation=True)
    summary_ids = model.generate(inputs["input_ids"], max_length=150, num_beams=4, early_stopping=True)
    return tokenizer.decode(summary_ids[0], skip_special_tokens=True)

    return summary

def summarize_pipeline(task_id: int, url: str):
    try:
        print(f"Обработка задачи {task_id} для {url}")
        
        video_path = download_video(url)
        print(f"Видео скачано")
        
        audio_path = extract_audio_to_wav(video_path)
        print(f"Аудио извлечено")
        
        transcript = transcribe_audio_wisper(audio_path)
        print(f"Транскрибировано: {len(transcript)} символов")
        
        summary = summarize_text(transcript)
        print(f"Суммаризация готова")
        
        db = SessionLocal()
        db_summary = db.query(Summary).filter(Summary.id == task_id).first()
        if db_summary:
            db_summary.summary = summary
            db.commit()
            print(f"Сохранено в БД")
        db.close()
        
        for file_path in [video_path, audio_path]:
            try:
                if file_path.exists():
                    file_path.unlink()
            except:
                pass
        
        print(f"Завершено: {summary[:100]}...")
        return summary
        
    except Exception as e:
        print(f"Ошибка: {e}")
        
        db = SessionLocal()
        db_summary = db.query(Summary).filter(Summary.id == task_id).first()
        if db_summary:
            db_summary.summary = f"Ошибка: {str(e)}"
            db.commit()
        db.close()
        
        raise
    