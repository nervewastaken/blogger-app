import React, { useState, useEffect } from 'react';

const AddComment = () => {
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const postId = localStorage.getItem('postId');
  const author = localStorage.getItem('username');

  useEffect(() => {
    const fetchBlogAndComments = async () => {
      try {
        const [blogResponse, commentsResponse] = await Promise.all([
          fetch(`http://localhost:4000/blogs/${postId}`, {
            headers: { 'Authorization': token }
          }),
          fetch(`http://localhost:4000/comments/${postId}`, {
            headers: { 'Authorization': token }
          })
        ]);

        if (!blogResponse.ok) {
          throw new Error('Failed to fetch blog');
        }
        const blogData = await blogResponse.json();
        setBlog(blogData);
        console.log(blogData);

        if (!commentsResponse.ok) {
          throw new Error('Failed to fetch comments');
        }
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };

    fetchBlogAndComments();
  }, [postId, token]);

  const addComment = () => {
    fetch('http://localhost:4000/comments', {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postId, content: newComment,username:author })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      setNewComment('');
      return fetch(`http://localhost:4000/comments/${postId}`, {
        headers: { 'Authorization': token }
      });
    })
    .then(res => res.json())
    .then(data => setComments(data))
    .catch(error => console.error(error));
  };

  const deleteComment = (commentId) => {
    fetch(`http://localhost:4000/comments/${commentId}`, {
      method: 'DELETE',
      headers: { 'Authorization': token }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
      return fetch(`http://localhost:4000/comments/${postId}`, {
        headers: { 'Authorization': token }
      });
    })
    .then(res => res.json())
    .then(data => setComments(data))
    .catch(error => console.error(error));
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!blog) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
      {blog.map(blog => (
        <div key={blog.id}>
          <h2>{blog.title}</h2>
          <p>{blog.content}</p>
        </div>
      ))}
      
      {comments.map(comment => (
        <div key={comment.id}>
          <p>{comment.content}</p>
          <p>Comment by: {comment.auth_name}</p>
          <button onClick={() => deleteComment(comment.id)}>Delete</button>
        </div>
      ))}
      <input 
        type="text" 
        value={newComment} 
        onChange={e => setNewComment(e.target.value)} 
        placeholder="Add a comment" 
      />
      <button onClick={addComment}>Submit</button>
    </div>
    </div>
  );
};

export default AddComment;
