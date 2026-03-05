import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import MainPage from './components/pages/mainPage/MainPage';
import AuthPage from './components/pages/autharization/AuthPage';
import RegisterPage from './components/pages/Registration/RegisterPage';
import AccountPage from './components/pages/account/AccountPage';
import ProjectsPage from './components/pages/projects/ProjectsPage';
import IntegrationPage from './components/pages/integration/IntegrationPage';

function App() {
  return (
    <Router >
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/organization/:orgId/projects" element={<ProjectsPage />} />
          <Route path="/account/organization/:orgId/project/:projectId" element={<IntegrationPage />} />
        </Routes>
      </div>
    </Router >
  );
}

export default App;
