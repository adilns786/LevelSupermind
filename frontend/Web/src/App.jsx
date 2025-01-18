// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Translation from './Pages/Task2/Translation';
import Home from './Pages/Home'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/translation" element={<Translation />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
