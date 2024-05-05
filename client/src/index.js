import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import HomePage from './components/Home';
import LoginPage from './components/Login';
import SignUp from './routes/SignUp';
import CreateBlog from './routes/CreateBlog';


const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/HomePage", element: <HomePage/> },
  { path: "/LoginPage", element: <LoginPage/>},
  { path: "/SignUp", element:<SignUp/>},
  { path: "/CreateBlog", element:<CreateBlog/>}
  
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

