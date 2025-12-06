from pydantic import BaseModel
from typing import List, Optional
from datetime import date

# --- CertificationEvent Schemas ---
class CertificationEventBase(BaseModel):
    sw_version: str
    status: Optional[str] = "Planned"
    due_date: date
    assignee: Optional[str] = None
    project_id: int
    mno_id: int

class CertificationEventCreate(CertificationEventBase):
    pass

class CertificationEventUpdate(BaseModel):
    status: str

class CertificationEvent(CertificationEventBase):
    id: int
    completed_date: Optional[date] = None

    class Config:
        orm_mode = True

# --- MNO Schemas ---
class MNOBase(BaseModel):
    name: str
    region: Optional[str] = None
    country: Optional[str] = None
    market_share: Optional[float] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class MNOCreate(MNOBase):
    pass

class MNO(MNOBase):
    id: int
    events: List[CertificationEvent] = []

    class Config:
        orm_mode = True

# --- Project Schemas ---
class ProjectBase(BaseModel):
    name: str
    oem_id: int

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    events: List[CertificationEvent] = []

    class Config:
        orm_mode = True

# --- OEM Schemas ---
class OEMBase(BaseModel):
    name: str

class OEMCreate(OEMBase):
    pass

class OEM(OEMBase):
    id: int
    projects: List[Project] = []

    class Config:
        orm_mode = True
