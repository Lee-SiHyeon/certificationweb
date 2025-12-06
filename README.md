# 차량용 통신 모듈 인증 이벤트 관리 시스템 (Automotive Telematics Certification Event Management System)

## 1. 프로젝트 개요 (Overview)
본 프로젝트는 LG전자 VS사업본부의 차량용 통신 모듈(NAD Unit)에 대한 복잡한 인증 프로세스를 체계적으로 관리하기 위한 웹 애플리케이션이다. 다양한 OEM(GM, JLR 등)의 수많은 프로젝트와 소프트웨어 버전에 따라 요구되는 MNO(AT&T, KT, Vodafone 등) 인증 이벤트를 추적하고 관리함으로써, 인증 누락으로 인한 리스크를 방지하고 관리 효율을 극대화하는 것을 목표로 한다.

## 2. 문제 정의 (Core Problem)
- **다중 변수:** OEM, 프로젝트, 소프트웨어 버전, MNO, 인증 종류(신규/유지보수) 등 추적해야 할 변수가 너무 많다.
- **높은 복잡도:** 각 프로젝트별로 요구되는 MNO 인증 조합이 모두 다르다.
- **휴먼 에러:** 수동 관리에 의존할 경우, 중요 인증 이벤트(예: SW 신규 버전에 따른 유지보수 인증)를 누락할 가능성이 높다.
- **정보 파편화:** 관련 정보가 여러 문서나 담당자에게 분산되어 있어 현황 파악이 어렵다.

## 3. 주요 기능 (Key Features)
- **중앙 대시보드:** 모든 인증 현황을 시각적으로 (긴급, 예정, 완료, 지연) 파악.
- **마스터 데이터 관리:**
    - OEM 및 하위 프로젝트 등록 및 관리 (예: GM > GEN10, GEN11 / JLR > P-IVI, TCUA)
    - MNO 정보 등록 및 관리
    - 프로젝트별 필요 MNO 인증 매핑
- **인증 이벤트 관리:**
    - 소프트웨어 버전 릴리즈 등 인증이 필요한 이벤트 생성.
    - 이벤트별 상태 (계획, 진행중, 완료), 담당자, 마감일 설정 및 추적.
- **알림 및 리포팅:** 마감일 임박 및 지연된 항목 자동 알림.
- **검색 및 필터:** OEM, MNO, 프로젝트, 인증 상태 등 다양한 조건으로 데이터 검색.

## 4. 기술 스택 (Tech Stack)
- **Backend:** Python, FastAPI
- **Frontend:** React (TypeScript)
- **Database:** SQLite (초기 개발), 추후 확장 가능
- **Styling:** Bootstrap, Material Design

## 5. 데이터베이스 스키마 (Database Schema)
| 테이블 (Table)              | 컬럼 (Columns)                                                              | 설명 (Description)                               |
| --------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------ |
| **oems**                    | `id` (PK), `name` (UNIQUE)                                                  | OEM 정보 (예: GM, JLR)                           |
| **projects**                | `id` (PK), `oem_id` (FK), `name`                                            | OEM의 하위 프로젝트 (예: GEN10, P-IVI)           |
| **mnos**                    | `id` (PK), `name` (UNIQUE)                                                  | MNO 정보 (예: AT&T, KT)                          |
| **certification_events**    | `id` (PK), `project_id` (FK), `mno_id` (FK), `sw_version`, `status`, `due_date` | 실제 발생하는 개별 인증 이벤트 관리              |

## 6. API 엔드포인트 정의 (API Endpoint Definitions)
- **OEMs**
    - `GET /api/oems/` : OEM 목록 조회
    - `POST /api/oems/` : OEM 생성
    - `GET /api/oems/{oem_id}/projects/` : 특정 OEM의 프로젝트 목록 조회
- **Projects**
    - `GET /api/projects/` : 전체 프로젝트 조회
    - `POST /api/projects/` : 프로젝트 생성
    - `GET /api/projects/{project_id}` : 프로젝트 상세 조회
    - `GET /api/projects/{project_id}/events` : 프로젝트별 이벤트 조회
- **MNOs**
    - `GET /api/mnos/` : MNO 목록 조회
    - `POST /api/mnos/` : MNO 생성
- **Certification Events**
    - `GET /api/events/` : 전체 이벤트 조회
    - `POST /api/events/` : 이벤트 생성

## 7. 개발 시작 가이드 (Getting Started)

### 필수 요구 사항 (Prerequisites)
- Python 3.8+
- Node.js 14+

### 백엔드 실행 (Backend Setup)
1. `backend` 디렉토리로 이동:
   ```bash
   cd backend
   ```
2. 가상 환경 생성 및 활성화:
   ```bash
   python -m venv .venv
   # Windows
   .\.venv\Scripts\activate
   # Mac/Linux
   source .venv/bin/activate
   ```
3. 의존성 설치:
   ```bash
   pip install fastapi "uvicorn[standard]" sqlalchemy
   ```
4. 서버 실행:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   서버는 `http://localhost:8000`에서 실행됩니다.

### 프론트엔드 실행 (Frontend Setup)
1. `frontend` 디렉토리로 이동:
   ```bash
   cd frontend
   ```
2. 의존성 설치:
   ```bash
   npm install
   ```
3. 개발 서버 실행:
   ```bash
   npm run dev
   ```
   웹 애플리케이션은 `http://localhost:5173`에서 확인할 수 있습니다.
