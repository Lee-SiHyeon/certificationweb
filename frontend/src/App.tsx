import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Overview from './components/Overview';
import OemList from './components/OemList';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import MnoManager from './components/MnoManager';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="overview" element={<Overview />} />
          <Route path="mnos" element={<MnoManager />} />
          <Route path="oems" element={<OemList />} />
          <Route path="oems/:oemId" element={<ProjectList />} />
          <Route path="projects/:projectId" element={<ProjectDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

