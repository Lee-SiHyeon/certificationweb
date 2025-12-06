from database import SessionLocal
import models

def seed_mnos():
    db = SessionLocal()
    
    mnos_data = [
        {"name": "Verizon", "region": "North America", "country": "USA", "market_share": 38.0, "latitude": 40.706, "longitude": -74.549},
        {"name": "AT&T", "region": "North America", "country": "USA", "market_share": 32.0, "latitude": 32.776, "longitude": -96.797},
        {"name": "T-Mobile", "region": "North America", "country": "USA", "market_share": 29.0, "latitude": 47.610, "longitude": -122.201},
        {"name": "Bell", "region": "North America", "country": "Canada", "market_share": 30.0, "latitude": 45.501, "longitude": -73.567},
        {"name": "Rogers", "region": "North America", "country": "Canada", "market_share": 32.0, "latitude": 43.653, "longitude": -79.383},
        {"name": "Telus", "region": "North America", "country": "Canada", "market_share": 28.0, "latitude": 49.282, "longitude": -123.120},
        {"name": "Vodafone", "region": "Europe", "country": "UK", "market_share": 20.0, "latitude": 51.401, "longitude": -1.323},
        {"name": "Deutsche Telekom", "region": "Europe", "country": "Germany", "market_share": 35.0, "latitude": 50.737, "longitude": 7.098},
        {"name": "Orange", "region": "Europe", "country": "France", "market_share": 40.0, "latitude": 48.856, "longitude": 2.352},
        {"name": "Telefonica", "region": "Europe", "country": "Spain", "market_share": 30.0, "latitude": 40.416, "longitude": -3.703},
        {"name": "China Mobile", "region": "Asia", "country": "China", "market_share": 60.0, "latitude": 39.904, "longitude": 116.407},
        {"name": "KDDI", "region": "Asia", "country": "Japan", "market_share": 27.0, "latitude": 35.689, "longitude": 139.691},
        {"name": "SoftBank", "region": "Asia", "country": "Japan", "market_share": 23.0, "latitude": 35.660, "longitude": 139.730},
        {"name": "SK Telecom", "region": "Asia", "country": "South Korea", "market_share": 45.0, "latitude": 37.566, "longitude": 126.978},
    ]

    print("Seeding MNOs...")
    for data in mnos_data:
        mno = db.query(models.MNO).filter(models.MNO.name == data["name"]).first()
        if not mno:
            print(f"Creating MNO: {data['name']}")
            mno = models.MNO(**data)
            db.add(mno)
        else:
            print(f"Updating MNO: {data['name']}")
            mno.region = data["region"]
            mno.country = data["country"]
            mno.market_share = data["market_share"]
            mno.latitude = data["latitude"]
            mno.longitude = data["longitude"]
        
    db.commit()
    db.close()

if __name__ == "__main__":
    seed_mnos()
