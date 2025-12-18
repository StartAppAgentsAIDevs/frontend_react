import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import MainPage from './components/pages/mainPage/MainPage';
import AuthPage from './components/ui/pages/autharization/AuthPage';

function App() {
  return (
    <Router >
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/auth" element={<AuthPage />} />

        </Routes>
      </div>
    </Router >
  );
}

export default App;
