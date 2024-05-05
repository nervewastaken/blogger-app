import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';

function App() {
  
  return (
    <div class="login-container">
        <div class="login-box">
            <h2>Login</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required />
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required />
                </div>
                <button type="submit">Login</button>
            </form>
            <p id="message"></p>
        </div>
        
        <Link to={"/HomePage"}>Let's go!</Link>
    </div>

  );
}

export default App;
