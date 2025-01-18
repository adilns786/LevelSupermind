// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Translation from './Pages/Task2/Translation';
import Home from './Pages/Home'
import SBInput from './Pages/Task3/SBInput';
import ArtFinder from './Pages/Task1/ARTFinder';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/translation" element={<Translation />} />
        <Route path="/" element={<Home />} />
        <Route path="/soulbudy/input" element={<SBInput />} />
        <Route path="/artfinder" element={<ArtFinder />} />
      </Routes>
    </Router>
  );
};

export default App;
