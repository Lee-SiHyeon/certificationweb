from typing import List

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

# FastAPI 애플리케이션 생성
app = FastAPI()

# CORS 미들웨어 추가
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Root ---
@app.get("/")
def read_root():
    return {"message": "Certification Management System Backend is running."}

# --- OEM Endpoints ---
@app.post("/api/oems/", response_model=schemas.OEM)
def create_oem(oem: schemas.OEMCreate, db: Session = Depends(get_db)):
    db_oem = crud.get_oem_by_name(db, name=oem.name)
    if db_oem:
        raise HTTPException(status_code=400, detail="OEM already registered")
    return crud.create_oem(db=db, oem=oem)

@app.get("/api/oems/", response_model=List[schemas.OEM])
def read_oems(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    oems = crud.get_oems(db, skip=skip, limit=limit)
    return oems

@app.get("/api/oems/{oem_id}/projects/", response_model=List[schemas.Project])
def read_oem_projects(oem_id: int, db: Session = Depends(get_db)):
    projects = crud.get_projects_by_oem(db, oem_id=oem_id)
    return projects


# --- Project Endpoints ---
@app.post("/api/projects/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)

@app.get("/api/projects/", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@app.get("/api/projects/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.get("/api/projects/{project_id}/events", response_model=List[schemas.CertificationEvent])
def read_project_events(project_id: int, db: Session = Depends(get_db)):
    events = crud.get_events_by_project(db, project_id=project_id)
    return events


# --- MNO Endpoints ---
@app.post("/api/mnos/", response_model=schemas.MNO)
def create_mno(mno: schemas.MNOCreate, db: Session = Depends(get_db)):
    return crud.create_mno(db=db, mno=mno)

@app.get("/api/mnos/", response_model=List[schemas.MNO])
def read_mnos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    mnos = crud.get_mnos(db, skip=skip, limit=limit)
    return mnos

# --- CertificationEvent Endpoints ---
@app.post("/api/events/", response_model=schemas.CertificationEvent)
def create_event(event: schemas.CertificationEventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db=db, event=event)

@app.get("/api/events/", response_model=List[schemas.CertificationEvent])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    events = crud.get_events(db, skip=skip, limit=limit)
    return events
