import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import './updatep.css'
const UpdatePost = () => {
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedContent, setUpdatedContent] = useState('');

  // Function to handle form submission
  const handleSubmit = async (e) => {
    const token = localStorage.getItem('token');
    e.preventDefault();
    try {
      const blogId = localStorage.getItem('updateBlogId'); // Fetch the blog ID from localStorage
      const response = await fetch(`http://localhost:4000/blogs/${blogId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token, // Don't forget to include the authorization token
        },
        body: JSON.stringify({ title: updatedTitle, content: updatedContent }), // Include updated title and content in the request body
      });

      if (response.ok) {
        console.log('Blog updated successfully');
      
        window.location.href = '/CreateBlog';
      } else {
        console.error('Failed to update blog');
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    }
  };

  return (
    <div>
      <Navbar/>
      <div className="update-post-container">
      <h2 className="update-post-heading">Update Post</h2>
      <form onSubmit={handleSubmit} className="update-post-form">
        <div className="form-group">
          <label htmlFor="updatedTitle">Updated Title:</label>
          <input
            type="text"
            id="updatedTitle"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label htmlFor="updatedContent">Updated Content:</label>
          <textarea
            id="updatedContent"
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
            required
            className="textarea-field"
          />
        </div>
        <button type="submit" className="submit-button">Update Post</button>
      </form>
    </div>
    </div>
  );
};

export default UpdatePost;
