import React from "react";
import { Link } from 'react-router-dom';
import './NavBar.css';


//I set ListView as the front page
const Navbar: React.FC = () => {
    return (
      <div className="navbar">
        <div className="container">
          <Link to="/" className="title" data-hover="Digimon is better than Pokemon">Pokemon GEN1 Explorer</Link>
          <div className="nav-links">
            <Link to="/" className="nav-link">List View</Link>
            <Link to="/gallery" className="nav-link">Gallery View</Link>
          </div>
        </div>
      </div>
    );
  };
  
  export default Navbar;