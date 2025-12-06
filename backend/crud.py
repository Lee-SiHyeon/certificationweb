from sqlalchemy.orm import Session

import models, schemas

# --- OEM CRUD ---
def get_oem(db: Session, oem_id: int):
    return db.query(models.OEM).filter(models.OEM.id == oem_id).first()

def get_oem_by_name(db: Session, name: str):
    return db.query(models.OEM).filter(models.OEM.name == name).first()

def get_oems(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.OEM).offset(skip).limit(limit).all()

def create_oem(db: Session, oem: schemas.OEMCreate):
    db_oem = models.OEM(name=oem.name)
    db.add(db_oem)
    db.commit()
    db.refresh(db_oem)
    return db_oem

# --- Project CRUD ---
def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Project).offset(skip).limit(limit).all()

def get_projects_by_oem(db: Session, oem_id: int):
    return db.query(models.Project).filter(models.Project.oem_id == oem_id).all()


def create_project(db: Session, project: schemas.ProjectCreate):
    db_project = models.Project(**project.dict())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

# --- MNO CRUD ---
def get_mnos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.MNO).offset(skip).limit(limit).all()
    
# --- CertificationEvent CRUD ---
def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.CertificationEvent).offset(skip).limit(limit).all()

def get_events_by_project(db: Session, project_id: int):
    return db.query(models.CertificationEvent).filter(models.CertificationEvent.project_id == project_id).all()

def create_mno(db: Session, mno: schemas.MNOCreate):
    db_mno = models.MNO(**mno.dict())
    db.add(db_mno)
    db.commit()
    db.refresh(db_mno)
    return db_mno

def create_event(db: Session, event: schemas.CertificationEventCreate):
    db_event = models.CertificationEvent(**event.dict())
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

def update_event_status(db: Session, event_id: int, status: str):
    db_event = db.query(models.CertificationEvent).filter(models.CertificationEvent.id == event_id).first()
    if db_event:
        db_event.status = status
        if status == "Completed":
            from datetime import date
            db_event.completed_date = date.today()
        else:
            db_event.completed_date = None
        db.commit()
        db.refresh(db_event)
    return db_event
    db.commit()
    db.refresh(db_event)
    return db_event


