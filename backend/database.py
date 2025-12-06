import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Get the directory of the current file (backend/)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
# Point to the parent directory (root) for the database file
DB_PATH = os.path.join(os.path.dirname(BASE_DIR), "cert_manager_v3.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# SQLAlchemy 엔진 생성
# connect_args는 SQLite에서만 필요합니다. (쓰레드 관련 설정)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

# 데이터베이스 세션 생성을 위한 SessionLocal 클래스
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 모델 클래스들이 상속받을 Base 클래스
Base = declarative_base()
