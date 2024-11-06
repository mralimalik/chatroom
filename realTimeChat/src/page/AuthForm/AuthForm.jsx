import React, { useState , useContext } from "react";
import "./AuthForm.css"; // Import the CSS file for styles
import axios from "axios";
import {AuthContext} from '../../context/AuthContext'


const AuthForm = () => {

  const { handleRegister, handleLogin, setFullName, setEmail, setPassword } = useContext(AuthContext);
  const [isSignIn, setIsSignIn] = useState(true);
 

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
  };




  return (
    <div className="auth-container">
      <div className="tab-bar">
        <button
          className={`tab-button ${isSignIn ? "active" : ""}`}
          onClick={toggleForm}
        >
          Sign In
        </button>
        <button
          className={`tab-button ${!isSignIn ? "active" : ""}`}
          onClick={toggleForm}
        >
          Register
        </button>
      </div>
      {isSignIn ? (
        <div className="form-container">
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Sign In</button>
          </form>
        </div>
      ) : (
        <div className="form-container">
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              required
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Register</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
