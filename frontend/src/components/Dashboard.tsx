import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api';

interface Event {
  id: number;
  project_id: number;
  mno_id: number;
  sw_version: string;
  status: string;
  due_date: string;
  completed_date?: string;
}

interface Project {
  id: number;
  name: string;
  oem_id: number;
}

interface Mno {
  id: number;
  name: string;
}

interface Oem {
  id: number;
  name: string;
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [mnos, setMnos] = useState<Mno[]>([]);
  const [oems, setOems] = useState<Oem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, projectsRes, mnosRes, oemsRes] = await Promise.all([
          apiClient.get('/events/'),
          apiClient.get('/projects/'),
          apiClient.get('/mnos/'),
          apiClient.get('/oems/')
        ]);
        setEvents(eventsRes.data);
        setProjects(projectsRes.data);
        setMnos(mnosRes.data);
        setOems(oemsRes.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="container mt-4">Loading dashboard...</div>;

  // Helper to get names
  const getProjectName = (id: number) => projects.find(p => p.id === id)?.name || 'Unknown';
  const getMnoName = (id: number) => mnos.find(m => m.id === id)?.name || 'Unknown';
  const getOemName = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return 'Unknown';
    return oems.find(o => o.id === project.oem_id)?.name || 'Unknown';
  };

  // Statistics
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.status === 'Completed').length;
  const inProgressEvents = events.filter(e => e.status === 'In Progress').length;
  
  // Delayed Logic: Due date passed AND not completed
  const today = new Date().toISOString().split('T')[0];
  const delayedEvents = events.filter(e => {
    return e.status !== 'Completed' && e.due_date < today;
  });

  // Upcoming Logic: Due within 7 days AND not completed/delayed
  const upcomingEvents = events.filter(e => {
    if (e.status === 'Completed') return false;
    if (e.due_date < today) return false; // Already delayed
    const diffTime = new Date(e.due_date).getTime() - new Date(today).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  });

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Certification Dashboard</h1>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary mb-3">
            <div className="card-header">Total Events</div>
            <div className="card-body">
              <h5 className="card-title display-4">{totalEvents}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-success mb-3">
            <div className="card-header">Completed</div>
            <div className="card-body">
              <h5 className="card-title display-4">{completedEvents}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-warning mb-3">
            <div className="card-header">In Progress</div>
            <div className="card-body">
              <h5 className="card-title display-4">{inProgressEvents}</h5>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-white bg-danger mb-3">
            <div className="card-header">Delayed</div>
            <div className="card-body">
              <h5 className="card-title display-4">{delayedEvents.length}</h5>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent / Delayed Table */}
      <div className="card mb-4 border-danger">
        <div className="card-header bg-danger text-white">
          <h5 className="mb-0">⚠️ Attention Required (Delayed & Upcoming)</h5>
        </div>
        <div className="card-body">
          {delayedEvents.length === 0 && upcomingEvents.length === 0 ? (
            <p className="text-success">No urgent issues! Good job.</p>
          ) : (
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>OEM</th>
                  <th>Project</th>
                  <th>MNO</th>
                  <th>SW Version</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {/* Delayed Items */}
                {delayedEvents.map(event => (
                  <tr key={event.id} className="table-danger">
                    <td><span className="badge bg-danger">Delayed</span></td>
                    <td>{event.due_date}</td>
                    <td>{getOemName(event.project_id)}</td>
                    <td>{getProjectName(event.project_id)}</td>
                    <td>{getMnoName(event.mno_id)}</td>
                    <td>{event.sw_version}</td>
                    <td>
                      <Link to={`/projects/${event.project_id}`} className="btn btn-sm btn-outline-dark">View</Link>
                    </td>
                  </tr>
                ))}
                {/* Upcoming Items */}
                {upcomingEvents.map(event => (
                  <tr key={event.id} className="table-warning">
                    <td><span className="badge bg-warning text-dark">Due Soon</span></td>
                    <td>{event.due_date}</td>
                    <td>{getOemName(event.project_id)}</td>
                    <td>{getProjectName(event.project_id)}</td>
                    <td>{getMnoName(event.mno_id)}</td>
                    <td>{event.sw_version}</td>
                    <td>
                      <Link to={`/projects/${event.project_id}`} className="btn btn-sm btn-outline-dark">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Activity or All Events could go here */}
    </div>
  );
};

export default Dashboard;
