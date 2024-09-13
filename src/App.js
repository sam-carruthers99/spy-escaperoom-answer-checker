import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Puzzle from './Puzzle';
import './App.css'

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/1" replace />} />
          {[...Array(8)].map((_, index) => (
            <Route path={`/${index + 1}`} element={<Puzzle puzzleNumber={index + 1} />} key={index} />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default App;

