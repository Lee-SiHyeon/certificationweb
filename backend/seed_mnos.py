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
        {"name": "SK Telecom", "region": "Asia", "country": "South Korea", "market_share": 43.0, "latitude": 37.5665, "longitude": 126.9780},
        {"name": "KT", "region": "Asia", "country": "South Korea", "market_share": 28.0, "latitude": 37.5720, "longitude": 126.9850},
        {"name": "LG Uplus", "region": "Asia", "country": "South Korea", "market_share": 23.0, "latitude": 37.5610, "longitude": 126.9710},
        {"name": "Telcel", "region": "North America", "country": "Mexico", "market_share": 62.0, "latitude": 19.4326, "longitude": -99.1332},
        {"name": "Movistar Mexico", "region": "North America", "country": "Mexico", "market_share": 18.0, "latitude": 19.4410, "longitude": -99.1420},
        {"name": "AT&T Mexico", "region": "North America", "country": "Mexico", "market_share": 14.0, "latitude": 19.4240, "longitude": -99.1240},
        {"name": "Vivo", "region": "South America", "country": "Brazil", "market_share": 38.0, "latitude": -23.5505, "longitude": -46.6333},
        {"name": "Claro Brasil", "region": "South America", "country": "Brazil", "market_share": 33.0, "latitude": -23.5610, "longitude": -46.6440},
        {"name": "TIM Brasil", "region": "South America", "country": "Brazil", "market_share": 24.0, "latitude": -23.5400, "longitude": -46.6220},
        {"name": "Jio", "region": "Asia", "country": "India", "market_share": 39.0, "latitude": 28.6139, "longitude": 77.2090},
        {"name": "Bharti Airtel", "region": "Asia", "country": "India", "market_share": 32.0, "latitude": 28.6210, "longitude": 77.2160},
        {"name": "Vi (Vodafone Idea)", "region": "Asia", "country": "India", "market_share": 17.0, "latitude": 28.6060, "longitude": 77.2010},
        {"name": "BSNL", "region": "Asia", "country": "India", "market_share": 9.0, "latitude": 28.6110, "longitude": 77.2210},
        {"name": "EE", "region": "Europe", "country": "UK", "market_share": 28.0, "latitude": 51.5074, "longitude": -0.1278},
        {"name": "O2 UK", "region": "Europe", "country": "UK", "market_share": 26.0, "latitude": 51.5160, "longitude": -0.1360},
        {"name": "Vodafone UK", "region": "Europe", "country": "UK", "market_share": 18.0, "latitude": 51.4990, "longitude": -0.1190},
        {"name": "Three UK", "region": "Europe", "country": "UK", "market_share": 10.0, "latitude": 51.5110, "longitude": -0.1090},
        {"name": "Orange", "region": "Europe", "country": "France", "market_share": 35.0, "latitude": 48.8566, "longitude": 2.3522},
        {"name": "SFR", "region": "Europe", "country": "France", "market_share": 25.0, "latitude": 48.8610, "longitude": 2.3610},
        {"name": "Bouygues Telecom", "region": "Europe", "country": "France", "market_share": 19.0, "latitude": 48.8510, "longitude": 2.3440},
        {"name": "Free Mobile", "region": "Europe", "country": "France", "market_share": 19.0, "latitude": 48.8660, "longitude": 2.3560},
        {"name": "Telekom (Deutsche Telekom)", "region": "Europe", "country": "Germany", "market_share": 32.0, "latitude": 50.1109, "longitude": 8.6821},
        {"name": "Vodafone Germany", "region": "Europe", "country": "Germany", "market_share": 30.0, "latitude": 50.1210, "longitude": 8.6910},
        {"name": "O2 Germany", "region": "Europe", "country": "Germany", "market_share": 29.0, "latitude": 50.1010, "longitude": 8.6710},
        {"name": "TIM", "region": "Europe", "country": "Italy", "market_share": 28.0, "latitude": 41.9028, "longitude": 12.4964},
        {"name": "Vodafone Italy", "region": "Europe", "country": "Italy", "market_share": 27.0, "latitude": 41.9110, "longitude": 12.5060},
        {"name": "Wind Tre", "region": "Europe", "country": "Italy", "market_share": 26.0, "latitude": 41.8940, "longitude": 12.4840},
        {"name": "Iliad Italy", "region": "Europe", "country": "Italy", "market_share": 11.0, "latitude": 41.9060,
        "longitude": 12.5010},
        {"name": "Movistar", "region": "Europe", "country": "Spain", "market_share": 28.0, "latitude": 40.4168, "longitude": -3.7038},
        {"name": "Orange Spain", "region": "Europe", "country": "Spain", "market_share": 23.0, "latitude": 40.4260, "longitude": -3.7160},
        {"name": "Vodafone Spain", "region": "Europe", "country": "Spain", "market_share": 18.0, "latitude": 40.4090, "longitude": -3.6940},
        {"name": "MasMovil", "region": "Europe", "country": "Spain", "market_share": 20.0, "latitude": 40.4210, "longitude": -3.7010},
        {"name": "Telstra", "region": "Oceania", "country": "Australia", "market_share": 42.0, "latitude": -33.8688, "longitude": 151.2093},
        {"name": "Optus", "region": "Oceania", "country": "Australia", "market_share": 26.0, "latitude": -33.8760, "longitude": 151.2160},
        {"name": "Vodafone Australia", "region": "Oceania", "country": "Australia", "market_share": 17.0, "latitude": -33.8590, "longitude": 151.1990},
        {"name": "China Mobile", "region": "Asia", "country": "China", "market_share": 60.0, "latitude": 39.904, "longitude": 116.407},
        {"name": "KDDI", "region": "Asia", "country": "Japan", "market_share": 27.0, "latitude": 35.689, "longitude": 139.691},
        {"name": "SoftBank", "region": "Asia", "country": "Japan", "market_share": 23.0, "latitude": 35.660, "longitude": 139.730},
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
