
from fastapi import FastAPI, HTTPException, BackgroundTasks
from pydantic import BaseModel
import uuid
from datetime import datetime
import threading
from fastapi.middleware.cors import CORSMiddleware

from db import init_db, Summary, SessionLocal
from summarizer import summarize_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processing_tasks = {}

class TaskRequest(BaseModel):
    url: str

class TaskResponse(BaseModel):
    task_id: str
    status: str

class TaskStatusResponse(BaseModel):
    task_id: str
    status: str
    summary_id: int = None
    summary: str = None

@app.on_event("startup")
def on_startup():
    init_db()

def process_video_sync(task_id: str, url: str):
    try:
        print(f"Start task {task_id}")
        
        db = SessionLocal()
        new_summary = Summary(url=url, summary="В работе")
        db.add(new_summary)
        db.commit()
        db.refresh(new_summary)
        
        processing_tasks[task_id] = {
            "status": "processing",
            "summary_id": new_summary.id
        }
        
        try:
            summarize_pipeline(new_summary.id, url)
            processing_tasks[task_id]["status"] = "completed"
            print(f"Саммаризация {task_id} завершена")
        except Exception as e:
            processing_tasks[task_id] = {
                "status": "failed",
                "error": str(e),
                "summary_id": new_summary.id
            }
        
        db.close()
        
    except Exception as e:
        processing_tasks[task_id] = {"status": "failed", "error": str(e)}

async def process_video_background(task_id: str, url: str):
    threading.Thread(target=process_video_sync, args=(task_id, url)).start()

@app.post("/api/tasks")
async def create_task(task_request: TaskRequest, background_tasks: BackgroundTasks):
    task_id = str(uuid.uuid4())
    
    processing_tasks[task_id] = {
        "status": "pending",
        "created_at": datetime.now(),
        "url": task_request.url
    }
    
    background_tasks.add_task(process_video_background, task_id, task_request.url)
    
    return TaskResponse(task_id=task_id, status="pending")

@app.get("/api/summaries/latest")
def get_latest_summary():
    db = SessionLocal()
    try:
        latest = db.query(Summary).order_by(Summary.created_at.desc()).first()
        if not latest:
            raise HTTPException(status_code=404, detail="No summaries")
        return latest
    finally:
        db.close()

@app.get("/api/tasks/{task_id}")
async def get_task_status(task_id: str):
    if task_id not in processing_tasks:
        raise HTTPException(status_code=404, detail="No Task")
    
    task_info = processing_tasks[task_id]
    response = TaskStatusResponse(task_id=task_id, status=task_info["status"])
    
    if task_info["status"] == "completed":
        db = SessionLocal()
        try:
            summary_id = task_info.get("summary_id")
            if summary_id:
                summary = db.query(Summary).filter(Summary.id == summary_id).first()
                if summary:
                    response.summary_id = summary.id
                    response.summary = summary.summary
        finally:
            db.close()
    elif task_info["status"] == "failed":
        response.summary = f"Ошибка: {task_info.get('error', 'Неизвестная ошибка')}"
    
    return response

@app.get("/api/summaries")
def get_all_summaries():
    db = SessionLocal()
    try:
        return db.query(Summary).order_by(Summary.created_at.desc()).all()
    finally:
        db.close()

@app.get("/api/summaries/{summary_id}")
def get_summary(summary_id: int):
    db = SessionLocal()
    try:
        item = db.query(Summary).filter(Summary.id == summary_id).first()
        if not item:
            raise HTTPException(status_code=404, detail="No summary")
        return item
    finally:
        db.close()