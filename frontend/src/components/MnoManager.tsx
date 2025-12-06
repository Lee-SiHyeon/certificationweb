// This is a temporary file to allow MNO creation.
// In a real app, this would be its own page.
import React, { useEffect, useState } from 'react';
import apiClient from '../api';

interface Mno {
  id: number;
  name: string;
  region?: string;
  country?: string;
  market_share?: number;
}

interface GroupedMnos {
  [region: string]: {
    [country: string]: Mno[];
  };
}

const MnoManager: React.FC = () => {
  const [mnos, setMnos] = useState<Mno[]>([]);
  const [groupedMnos, setGroupedMnos] = useState<GroupedMnos>({});
  const [newMnoName, setNewMnoName] = useState('');
  const [error, setError] = useState('');

  const fetchMnos = async () => {
    try {
      const response = await apiClient.get('/mnos/');
      const data: Mno[] = response.data;
      setMnos(data);
      groupMnos(data);
    } catch (err) {
      setError('Failed to fetch MNO list.');
    }
  };

  const groupMnos = (data: Mno[]) => {
    const groups: GroupedMnos = {};
    data.forEach(mno => {
      const region = mno.region || 'Unknown Region';
      const country = mno.country || 'Unknown Country';

      if (!groups[region]) {
        groups[region] = {};
      }
      if (!groups[region][country]) {
        groups[region][country] = [];
      }
      groups[region][country].push(mno);
    });
    setGroupedMnos(groups);
  };

  useEffect(() => {
    fetchMnos();
  }, []);

  const handleCreateMno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMnoName.trim()) return;
    try {
      // Currently only name is supported in this simple form. 
      // To support region/country, we would need more inputs.
      await apiClient.post('/mnos/', { name: newMnoName });
      setNewMnoName('');
      fetchMnos();
    } catch (err) {
      setError('Failed to create MNO.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">MNO Management</h2>
      
      {/* Simple Add Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">Add New MNO</h5>
          <form onSubmit={handleCreateMno} className="d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="MNO Name"
              value={newMnoName}
              onChange={(e) => setNewMnoName(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Add</button>
          </form>
          {error && <p className="text-danger mt-2">{error}</p>}
        </div>
      </div>

      {/* Grouped Display */}
      <div className="row">
        {Object.keys(groupedMnos).sort().map(region => (
          <div key={region} className="col-12 mb-4">
            <div className="card shadow-sm">
              <div className="card-header bg-secondary text-white">
                <h4 className="mb-0">{region}</h4>
              </div>
              <div className="card-body">
                <div className="row">
                  {Object.keys(groupedMnos[region]).sort().map(country => (
                    <div key={country} className="col-md-6 col-lg-4 mb-3">
                      <div className="card h-100 border-light">
                        <div className="card-header bg-light">
                          <strong>{country}</strong>
                        </div>
                        <ul className="list-group list-group-flush">
                          {groupedMnos[region][country]
                            .sort((a, b) => (b.market_share || 0) - (a.market_share || 0)) // Sort by market share desc
                            .map(mno => (
                            <li key={mno.id} className="list-group-item d-flex justify-content-between align-items-center">
                              {mno.name}
                              {mno.market_share && (
                                <span className="badge bg-info text-dark rounded-pill">
                                  {mno.market_share}%
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MnoManager;
