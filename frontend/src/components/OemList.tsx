import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api';

// OEM 데이터의 타입을 정의합니다.
interface Oem {
  id: number;
  name: string;
}

const OemList: React.FC = () => {
  const [oems, setOems] = useState<Oem[]>([]);
  const [newOemName, setNewOemName] = useState('');
  const [error, setError] = useState('');

  // OEM 목록을 가져오는 함수
  const fetchOems = async () => {
    try {
      const response = await apiClient.get('/oems/');
      setOems(response.data);
    } catch (err) {
      setError('OEM 목록을 불러오는 데 실패했습니다.');
      console.error(err);
    }
  };

  // 컴포넌트가 처음 렌더링될 때 OEM 목록을 불러옵니다.
  useEffect(() => {
    fetchOems();
  }, []);

  // 새로운 OEM을 생성하는 함수
  const handleCreateOem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOemName.trim()) {
      setError('OEM 이름은 비워둘 수 없습니다.');
      return;
    }
    try {
      await apiClient.post('/oems/', { name: newOemName });
      setNewOemName('');
      setError('');
      fetchOems(); // 목록을 다시 불러와 화면을 갱신합니다.
    } catch (err: any) {
      if (err.response && err.response.status === 400) {
        setError('이미 등록된 OEM입니다.');
      } else {
        setError('OEM 생성에 실패했습니다.');
      }
      console.error(err);
    }
  };

  return (
    <div>
      <h2>OEMs Management</h2>
      
      {/* OEM 생성 폼 */}
      <form onSubmit={handleCreateOem} className="mb-4 p-4 border rounded">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="New OEM Name (e.g., GM, JLR)"
            value={newOemName}
            onChange={(e) => setNewOemName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add OEM</button>
        </div>
        {error && <div className="form-text text-danger mt-1">{error}</div>}
      </form>

      {/* OEM 목록 테이블 */}
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Name</th>
          </tr>
        </thead>
        <tbody>
          {oems.map((oem) => (
            <tr key={oem.id}>
              <th scope="row">{oem.id}</th>
              <td>
                <Link to={`/oems/${oem.id}`}>{oem.name}</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OemList;
