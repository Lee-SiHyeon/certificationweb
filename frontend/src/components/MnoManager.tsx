// This is a temporary file to allow MNO creation.
// In a real app, this would be its own page.
import React, { useEffect, useState } from 'react';
import apiClient from '../api';

interface Mno {
  id: number;
  name: string;
}

const MnoManager: React.FC = () => {
  const [mnos, setMnos] = useState<Mno[]>([]);
  const [newMnoName, setNewMnoName] = useState('');
  const [error, setError] = useState('');

  const fetchMnos = async () => {
    try {
      const response = await apiClient.get('/mnos/');
      setMnos(response.data);
    } catch (err) {
      setError('MNO 목록을 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchMnos();
  }, []);

  const handleCreateMno = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMnoName.trim()) return;
    try {
      await apiClient.post('/mnos/', { name: newMnoName });
      setNewMnoName('');
      fetchMnos();
    } catch (err) {
      setError('MNO 생성에 실패했습니다.');
    }
  };

  return (
    <div>
      <h3>(Temp) MNO Management</h3>
      <form onSubmit={handleCreateMno} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="New MNO Name (e.g., AT&T, Vodafone)"
            value={newMnoName}
            onChange={(e) => setNewMnoName(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">Add MNO</button>
        </div>
      </form>
      {error && <p className="text-danger">{error}</p>}
      <h5>Existing MNOs</h5>
      <ul className="list-group">
        {mnos.map(mno => <li key={mno.id} className="list-group-item">{mno.name}</li>)}
      </ul>
    </div>
  );
};

export default MnoManager;
