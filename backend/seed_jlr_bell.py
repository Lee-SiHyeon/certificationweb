from database import SessionLocal
import crud, schemas, models

def seed_jlr_bell():
    db = SessionLocal()
    
    # 1. Ensure Bell MNO exists
    # Checking if Bell exists using direct query
    bell_mno = db.query(models.MNO).filter(models.MNO.name == "Bell").first()
    if not bell_mno:
        print("Creating MNO: Bell")
        bell_mno = models.MNO(name="Bell")
        db.add(bell_mno)
        db.commit()
        db.refresh(bell_mno)
    else:
        print("MNO 'Bell' already exists")

    # 2. Ensure JLR OEM exists
    jlr_oem = crud.get_oem_by_name(db, name="JLR")
    if not jlr_oem:
        print("Creating OEM: JLR")
        jlr_oem = models.OEM(name="JLR")
        db.add(jlr_oem)
        db.commit()
        db.refresh(jlr_oem)
    else:
        print("OEM 'JLR' already exists")

    # 3. Ensure TCUA Project exists under JLR
    # Check if project exists
    tcua_project = db.query(models.Project).filter(models.Project.name == "TCUA", models.Project.oem_id == jlr_oem.id).first()
    if not tcua_project:
        print("Creating Project: TCUA under JLR")
        tcua_project = models.Project(name="TCUA", oem_id=jlr_oem.id)
        db.add(tcua_project)
        db.commit()
        db.refresh(tcua_project)
    else:
        print("Project 'TCUA' already exists under JLR")

    # 4. Create a sample event for JLR-TCUA-Bell if none exists
    # This makes it visible in the system immediately
    existing_event = db.query(models.CertificationEvent).filter(
        models.CertificationEvent.project_id == tcua_project.id,
        models.CertificationEvent.mno_id == bell_mno.id
    ).first()

    if not existing_event:
        print("Creating sample event for JLR-TCUA-Bell")
        from datetime import date, timedelta
        new_event = models.CertificationEvent(
            project_id=tcua_project.id,
            mno_id=bell_mno.id,
            sw_version="v1.0_Initial",
            status="Planned",
            due_date=date.today() + timedelta(days=30)
        )
        db.add(new_event)
        db.commit()
    else:
        print("Sample event for JLR-TCUA-Bell already exists")

    db.close()

if __name__ == "__main__":
    seed_jlr_bell()
