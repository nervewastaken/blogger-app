import React, { useState, useEffect } from 'react';
import './Home.css'; // Import CSS file for styling
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import './navbar.css'
const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const token = localStorage.getItem('token');
  // Function to fetch all blogs
  const fetchBlogs = async () => {
    try {
      const response = await fetch('http://localhost:4000/blogs',{
        method:'GET',
        headers:{
          'Authorization' : token
        }
      })
      if (response.ok) {
        const data = await response.json();
        setBlogs(data);
      } else {
        console.error('Failed to fetch blogs');
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []); // Run once on component mount

  return (
    <div>
      <Navbar/>
    <div className="home-container">
      
          {blogs.map(blog => (
            <div className="blog-card" key={blog.id}>
            <h3>{blog.title}</h3>
            <p>Author: {blog.auth_name}</p>
            <p>{blog.content}</p>
            </div>
          ))}
      
    </div>
    </div>
  );
};

export default Home;
