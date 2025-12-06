import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import MainPage from './components/pages/mainPage/MainPage';

function App() {
  return (
    <Router >
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />} />

        </Routes>
      </div>
    </Router >
  );
}

export default App;
