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
}

interface Project {
  id: number;
  name: string;
  oem_id: number;
  events?: Event[]; // We will manually attach events here for display
}

interface Mno {
  id: number;
  name: string;
}

interface Oem {
  id: number;
  name: string;
  projects?: Project[]; // We will manually attach projects here
}

const Overview: React.FC = () => {
  const [oems, setOems] = useState<Oem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [oemsRes, projectsRes, eventsRes, mnosRes] = await Promise.all([
          apiClient.get('/oems/'),
          apiClient.get('/projects/'),
          apiClient.get('/events/'),
          apiClient.get('/mnos/')
        ]);

        const allOems: Oem[] = oemsRes.data;
        const allProjects: Project[] = projectsRes.data;
        const allEvents: Event[] = eventsRes.data;
        const allMnos: Mno[] = mnosRes.data;

        setMnos(allMnos);

        // Build the hierarchy: OEM -> Project -> Events
        const hierarchy = allOems.map(oem => {
          const oemProjects = allProjects.filter(p => p.oem_id === oem.id).map(project => {
            const projectEvents = allEvents.filter(e => e.project_id === project.id);
            return { ...project, events: projectEvents };
          });
          return { ...oem, projects: oemProjects };
        });

        setOems(hierarchy);
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Helper to get MNO name
  const [mnos, setMnos] = useState<Mno[]>([]);
  const getMnoName = (id: number) => mnos.find(m => m.id === id)?.name || 'Unknown';


  if (loading) return <div className="container mt-4">Loading overview...</div>;

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Project Overview</h1>
      <p className="text-muted">A hierarchical view of all OEMs, Projects, and Certification Events.</p>

      <div className="accordion" id="oemAccordion">
        {oems.map((oem, index) => (
          <div className="accordion-item" key={oem.id}>
            <h2 className="accordion-header" id={`heading${oem.id}`}>
              <button 
                className={`accordion-button ${index !== 0 ? 'collapsed' : ''}`} 
                type="button" 
                data-bs-toggle="collapse" 
                data-bs-target={`#collapse${oem.id}`} 
                aria-expanded={index === 0 ? 'true' : 'false'} 
                aria-controls={`collapse${oem.id}`}
              >
                <strong>{oem.name}</strong> 
                <span className="badge bg-secondary ms-2">{oem.projects?.length || 0} Projects</span>
              </button>
            </h2>
            <div 
                id={`collapse${oem.id}`} 
                className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`} 
                aria-labelledby={`heading${oem.id}`} 
                data-bs-parent="#oemAccordion"
            >
              <div className="accordion-body">
                {oem.projects && oem.projects.length > 0 ? (
                  <div className="row">
                    {oem.projects.map(project => (
                      <div className="col-md-6 mb-3" key={project.id}>
                        <div className="card h-100">
                          <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">{project.name}</h5>
                            <Link to={`/projects/${project.id}`} className="btn btn-sm btn-outline-primary">Details</Link>
                          </div>
                          <div className="card-body">
                            {project.events && project.events.length > 0 ? (
                              <ul className="list-group list-group-flush">
                                {project.events.map(event => (
                                  <li className="list-group-item d-flex justify-content-between align-items-center" key={event.id}>
                                    <span>
                                        <span className="fw-bold">{getMnoName(event.mno_id)}</span>
                                        <span className="text-muted ms-2">({event.sw_version})</span>
                                    </span>
                                    <span className={`badge ${
                                        event.status === 'Completed' ? 'bg-success' : 
                                        event.status === 'Delayed' ? 'bg-danger' : 
                                        event.status === 'In Progress' ? 'bg-warning text-dark' : 'bg-secondary'
                                    }`}>
                                      {event.status}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted mb-0">No active certification events.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No projects registered for this OEM.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
