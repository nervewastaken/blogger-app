import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./login.css"

const Login = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // Function to handle form submission (login)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const password = formData.get('password');

    try {
      const response = await fetch('http://localhost:4000/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      localStorage.setItem('username', name); // Save username in local storage
      localStorage.setItem('token', data.token);
      
      setAuthenticated(true);
    } catch (err) {
      console.error(err);
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
    <div className="login-box">
      <h2>Login</h2>
      <form id="loginForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Username:</label>
          <input type="text" id="name" name="name" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
        {error && <p className="error-message">{error}</p>}
      </form>
      <button className="signup-link"><Link to="/SignUp">Need an Account?</Link></button>
      <p id="message"></p>
    </div>
    
    {authenticated && <Link to="/HomePage">Let's go!</Link>}
  </div>
  );
};

export default Login;
