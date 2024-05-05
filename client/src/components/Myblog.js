import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import './myblog.css';

const MyBlog = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [userBlogs, setUserBlogs] = useState([]);
  const token = localStorage.getItem('token');
  useEffect(() => {
    // Fetch user's blogs
    const fetchUserBlogs = async () => {
      try {
        const username = localStorage.getItem('username');
        
        const response = await fetch('http://localhost:4000/my-blogs', {
          method: 'POST',
          headers: {
            'Authorization':token,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username }),
        });
       

        if (response.ok) {
          const data = await response.json();
          setUserBlogs(data);
          
        } else {
          console.error('Failed to fetch user blogs');
        }
      } catch (error) {
        console.error('Error fetching user blogs:', error);
      }
    };

    fetchUserBlogs();
  }, []); // Run once on component mount

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Retrieve username from local storage
      const username = localStorage.getItem('username');

      const response = await fetch('http://localhost:4000/blogs', {
        method: 'POST',
        headers: {
            'Authorization':token,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({ title, content, username }),
         // Include username in the request body
      });

      if (!response.ok) {
        throw new Error('Failed to create blog');
        
      }

      // Clear the input fields after successful creation
      setTitle('');
      setContent('');
      setMessage('Blog created successfully');
      window.location.reload()

      // Optionally, you can redirect the user to a different page
      // window.location.href = '/my-blogs';
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container">
      <Navbar />
      <div className="form-container">
        <h2>Create Blog</h2>
        <form onSubmit={handleSubmit} className="blog-form">
          <div className="form-group">
            <label htmlFor="title">Title:</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">Content:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <button type="submit">Create Blog</button>
          {message && <p className="success-message">{message}</p>}
        </form>
      </div>
      <div className="blog-list">
        <h2>Your Blogs</h2>
        <div className="blog-container">
  {userBlogs.map((blog) => (
    <div key={blog.id} className="blog-box">
      <div className="blog-header">
        <strong>{blog.title}</strong>
        <div className="button-container">
          <button className="update-button">Update</button>
          <button className="delete-button">Delete</button>
        </div>
      </div>
      <p className="blog-content">{blog.content}</p>
      <p className="blog-author">Author: {blog.auth_name}</p>
    </div>
  ))}
</div>

      </div>
    </div>
  );
};

export default MyBlog;
