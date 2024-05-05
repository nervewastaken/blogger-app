import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('username');
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <div className="navbar-links">
          <Link to="/HomePage"><button>Home</button></Link>
          <Link to="/CreateBlog"><button>My Blogs</button></Link>
        </div>
        <div className="navbar-profile">
          <span>Welcome, {username}</span>
          <Link to={"/"}><button onClick={handleLogout}>Logout</button></Link>
        </div>
      </div>
      
    </div>
  );
};

export default Navbar;
