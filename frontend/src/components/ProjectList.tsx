import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../api';

interface Project {
  id: number;
  name: string;
  oem_id: number;
}

const ProjectList: React.FC = () => {
  const { oemId } = useParams<{ oemId: string }>();
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [error, setError] = useState('');

  const fetchProjects = async () => {
    if (oemId) {
      try {
        const response = await apiClient.get(`/oems/${oemId}/projects/`);
        setProjects(response.data);
      } catch (err) {
        setError('프로젝트 목록을 불러오는 데 실패했습니다.');
        console.error(err);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [oemId]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !oemId) {
      setError('프로젝트 이름을 입력해주세요.');
      return;
    }
    try {
      await apiClient.post('/projects/', { name: newProjectName, oem_id: parseInt(oemId) });
      setNewProjectName('');
      setError('');
      fetchProjects(); // Re-fetch projects to show the new one
    } catch (err) {
      setError('프로젝트 생성에 실패했습니다.');
      console.error(err);
    }
  };

  return (
    <div>
      <h2 className="mb-3">Projects for OEM #{oemId}</h2>
      
      {/* Create Project Form */}
      <form onSubmit={handleCreateProject} className="mb-4 p-4 border rounded">
         <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="New Project Name (e.g., GEN13, P-IVI)"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Add Project</button>
        </div>
        {error && <div className="form-text text-danger mt-1">{error}</div>}
      </form>

      {/* Project List */}
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="list-group">
        {projects.map(project => (
          <Link 
            key={project.id} 
            to={`/projects/${project.id}`} 
            className="list-group-item list-group-item-action"
          >
            {project.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;

