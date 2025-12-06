from database import SessionLocal
import crud, schemas

def seed_oems():
    db = SessionLocal()
    oem_names = ["JLR", "HONDA", "TOYOTA", "BMW", "GM"]
    
    print("Seeding OEMs...")
    for name in oem_names:
        existing_oem = crud.get_oem_by_name(db, name=name)
        if not existing_oem:
            oem_data = schemas.OEMCreate(name=name)
            crud.create_oem(db, oem_data)
            print(f"Created OEM: {name}")
        else:
            print(f"OEM already exists: {name}")
    
    db.close()

if __name__ == "__main__":
    seed_oems()
