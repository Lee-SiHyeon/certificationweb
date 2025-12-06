from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Date, Float
from sqlalchemy.orm import relationship

from database import Base

class OEM(Base):
    __tablename__ = "oems"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)

    projects = relationship("Project", back_populates="owner_oem")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    oem_id = Column(Integer, ForeignKey("oems.id"))

    owner_oem = relationship("OEM", back_populates="projects")
    events = relationship("CertificationEvent", back_populates="project")

class MNO(Base):
    __tablename__ = "mnos"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    region = Column(String, nullable=True)
    country = Column(String, nullable=True)
    market_share = Column(Float, nullable=True) # Percentage (e.g., 35.5)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)

    events = relationship("CertificationEvent", back_populates="mno")


class CertificationEvent(Base):
    __tablename__ = "certification_events"

    id = Column(Integer, primary_key=True, index=True)
    sw_version = Column(String, index=True)
    status = Column(String, default="Planned")
    due_date = Column(Date)
    completed_date = Column(Date, nullable=True)
    assignee = Column(String, nullable=True)
    
    project_id = Column(Integer, ForeignKey("projects.id"))
    mno_id = Column(Integer, ForeignKey("mnos.id"))

    project = relationship("Project", back_populates="events")
    mno = relationship("MNO", back_populates="events")
