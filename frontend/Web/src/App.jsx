// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Translation from './Pages/Task2/Translation';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/translation" element={<Translation />} />
      </Routes>
    </Router>
  );
};

export default App;
