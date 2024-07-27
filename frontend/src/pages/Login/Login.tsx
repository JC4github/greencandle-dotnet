import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "./Login.css";
import googleLogo from "../../assets/google.png";
import faceLogo from "../../assets/facebook.png";

const CustomLogin: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        navigate("/"); // Redirect if user is logged in
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async () => {
    if (isSigningUp) {
      // Attempt to create a new user
      try {
        await firebase.auth().createUserWithEmailAndPassword(email, password);
        navigate("/"); // Navigate to the home page or dashboard
      } catch (error: any) {
        setError(error.message); // Handle errors like email already in use or bad format
      }
    } else {
      // Attempt to sign in the existing user
      try {
        await firebase.auth().signInWithEmailAndPassword(email, password);
        navigate("/"); // Navigate to the home page or dashboard
      } catch (error: any) {
        setError(error.message); // Handle errors like user not found or wrong password
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleFacebookLogin = async () => {
    const provider = new firebase.auth.FacebookAuthProvider();
    try {
      await firebase.auth().signInWithPopup(provider);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const toggleSignUp = () => {
    setIsSigningUp(!isSigningUp); // Toggle the sign up state
    setEmail(""); // Clear the email input field
    setPassword(""); // Clear the password input field
  };

  return (
    <div className={`main-container ${isSigningUp ? "signup-mode" : ""}`}>
      <div className="container">
        <h2 className="title">
          {isSigningUp ? "Create New Account" : "Login to Your Account"}
        </h2>
        <div className="social-login">
          <button className="google-btn" onClick={handleGoogleLogin}>
            <img src={googleLogo} alt="Google" className="google-logo" />
            <span className="google-btn-text">Google</span>
          </button>
          <button className="google-btn" onClick={handleFacebookLogin}>
            <img src={faceLogo} alt="Facebook" className="google-logo" />
            <span className="google-btn-text">Facebook</span>
          </button>
        </div>
        <div className="input-container">
          <input
            defaultValue=""
            type="email"
            placeholder={email ? "" : "Enter your email"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="inputField"
          />
          <div className="password-group">
            <input
              defaultValue=""
              type={showPassword ? "text" : "password"}
              placeholder={password ? "" : "Enter your password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="inputField"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button onClick={handleLogin} className="button" type="submit">
          {isSigningUp ? "Sign Up" : "Sign In"}
        </button>
      </div>
      <div className="side-panel">
        <h2 className="side-title">
          {isSigningUp ? "Have an Account?" : "Don't have an account?"}
        </h2>
        <p className="side-subtitle">
          {isSigningUp ? "Sign In Now!" : "Sign Up Now!"}
        </p>
        <button onClick={toggleSignUp} className="side-button">
          {isSigningUp ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </div>
  );
};

export default CustomLogin;
