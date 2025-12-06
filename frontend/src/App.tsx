import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import OemList from './components/OemList';
import './App.css';

// Placeholder components for the new structure
const Dashboard = () => <h2>Dashboard</h2>;
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';

import MnoManager from './components/MnoManager';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MnoManager />} />
          <Route path="oems" element={<OemList />} />
          <Route path="oems/:oemId" element={<ProjectList />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

