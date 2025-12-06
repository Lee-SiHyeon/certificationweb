import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import apiClient from '../api';
import L from 'leaflet';

// Fix for default marker icon in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Mno {
  id: number;
  name: string;
  region?: string;
  country?: string;
  market_share?: number;
  latitude?: number;
  longitude?: number;
}

const MnoMap: React.FC = () => {
  const [mnos, setMnos] = useState<Mno[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMnos = async () => {
      try {
        const response = await apiClient.get('/mnos/');
        setMnos(response.data);
      } catch (error) {
        console.error("Error fetching MNOs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMnos();
  }, []);

  if (loading) return <div className="container mt-4">Loading map...</div>;

  // Filter MNOs that have coordinates
  const mnosWithLocation = mnos.filter(m => m.latitude && m.longitude);

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Global MNO Map</h1>
      <p className="text-muted">Locations and Market Share of major Mobile Network Operators.</p>
      
      <div style={{ height: '600px', width: '100%', border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {mnosWithLocation.map(mno => (
            <CircleMarker 
              key={mno.id} 
              center={[mno.latitude!, mno.longitude!]}
              radius={mno.market_share ? Math.max(5, mno.market_share / 2) : 10}
              pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.5 }}
            >
              <Popup>
                <strong>{mno.name}</strong> <br />
                Region: {mno.region} <br />
                Country: {mno.country || 'N/A'} <br />
                Market Share: {mno.market_share ? `${mno.market_share}%` : 'N/A'}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MnoMap;
