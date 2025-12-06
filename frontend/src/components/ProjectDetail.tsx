import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '../api';

// Type definitions
interface Project {
  id: number;
  name: string;
}
interface Event {
  id: number;
  sw_version: string;
  status: string;
  due_date: string;
  mno_id: number;
}
interface Mno {
    id: number;
    name: string;
}

const ProjectDetail: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [mnos, setMnos] = useState<Mno[]>([]);
  const [error, setError] = useState('');

  // Form state for new event
  const [swVersion, setSwVersion] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedMno, setSelectedMno] = useState('');


  useEffect(() => {
    if (projectId) {
      const fetchProjectDetails = async () => {
        try {
          // Fetch project details, events, and all MNOs in parallel
          const [projectRes, eventsRes, mnosRes] = await Promise.all([
            apiClient.get(`/projects/${projectId}`),
            apiClient.get(`/projects/${projectId}/events`),
            apiClient.get('/mnos/')
          ]);
          setProject(projectRes.data);
          setEvents(eventsRes.data);
          setMnos(mnosRes.data);
          if (mnosRes.data.length > 0) {
            setSelectedMno(mnosRes.data[0].id.toString());
          }

        } catch (err) {
          setError('프로젝트 상세 정보를 불러오는 데 실패했습니다.');
          console.error(err);
        }
      };
      fetchProjectDetails();
    }
  }, [projectId]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!swVersion || !dueDate || !selectedMno || !projectId) {
        setError("모든 필드를 채워주세요.");
        return;
    }
    try {
        await apiClient.post('/events/', {
            sw_version: swVersion,
            due_date: dueDate,
            mno_id: parseInt(selectedMno),
            project_id: parseInt(projectId),
            status: "Planned"
        });
        // Reset form and re-fetch events
        setSwVersion('');
        setDueDate('');
        setError('');
        const eventsRes = await apiClient.get(`/projects/${projectId}/events`);
        setEvents(eventsRes.data);

    } catch (err) {
        setError('인증 이벤트 생성에 실패했습니다.');
        console.error(err);
    }
  };

  const handleStatusChange = async (eventId: number, newStatus: string) => {
    try {
        await apiClient.put(`/events/${eventId}/status`, { status: newStatus });
        // Update local state to reflect change immediately
        setEvents(events.map(e => e.id === eventId ? { ...e, status: newStatus } : e));
    } catch (err) {
        console.error("Failed to update status", err);
        alert("상태 업데이트에 실패했습니다.");
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!project) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="mb-4">Project: {project.name}</h1>

      {/* Create New Event Form */}
      <div className="card mb-4">
        <div className="card-header">
            <h4>Create New Certification Event</h4>
        </div>
        <div className="card-body">
            <form onSubmit={handleCreateEvent}>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <label htmlFor="swVersion" className="form-label">SW Version</label>
                        <input type="text" className="form-control" id="swVersion" value={swVersion} onChange={e => setSwVersion(e.target.value)} placeholder="e.g., v1.2.3"/>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="mno" className="form-label">MNO</label>
                        <select id="mno" className="form-select" value={selectedMno} onChange={e => setSelectedMno(e.target.value)}>
                            {mnos.map(mno => <option key={mno.id} value={mno.id}>{mno.name}</option>)}
                        </select>
                    </div>
                    <div className="col-md-4 mb-3">
                        <label htmlFor="dueDate" className="form-label">Due Date</label>
                        <input type="date" className="form-control" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Create Event</button>
            </form>
        </div>
      </div>

      {/* Event List */}
      <div className="card">
         <div className="card-header">
            <h4>Certification Events</h4>
        </div>
        <div className="card-body">
            <table className="table">
                <thead>
                <tr>
                    <th>SW Version</th>
                    <th>MNO</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {events.map(event => (
                    <tr key={event.id}>
                    <td>{event.sw_version}</td>
                    <td>{mnos.find(m => m.id === event.mno_id)?.name || 'N/A'}</td>
                    <td>{event.due_date}</td>
                    <td>
                        <select 
                            className={`form-select form-select-sm ${
                                event.status === 'Completed' ? 'bg-success text-white' : 
                                event.status === 'Delayed' ? 'bg-danger text-white' : 
                                event.status === 'In Progress' ? 'bg-warning text-dark' : ''
                            }`}
                            value={event.status}
                            onChange={(e) => handleStatusChange(event.id, e.target.value)}
                        >
                            <option value="Planned">Planned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Delayed">Delayed</option>
                        </select>
                    </td>
                    <td>
                        {/* Placeholder for future actions like delete */}
                        <button className="btn btn-sm btn-outline-secondary" disabled>Edit</button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
