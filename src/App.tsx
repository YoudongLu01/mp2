import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './component/NavBar';
import ListView from './component/ListView';
import GalleryView from './component/GalleryView';
import DetailView from './component/DetailView';
import './App.css';


const App: React.FC = () => {
  return (
    <Router basename='mp2'>
      <div className="app">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<ListView />} />
          <Route path="/gallery" element={<GalleryView />} />
          <Route path="/pokemon/:id" element={<DetailView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;