import React from 'react';
import api from '../../../src/api';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import '../../CSS/usercss/Userregister.css';

const Userregister = () => {
  const nav = useNavigate();

  const handaleonform = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      mobilenumber: e.target.mobilenumber.value,
      address: e.target.address.value,
      password: e.target.password.value
    };

    try {
      await api.post("/api/auth/user/register", formData);
      toast.success("Registered successfully!", { position: 'bottom-right' });
      setTimeout(() => nav("/user/login"), 2000);
    } catch (err) {
      toast.error("Registration Failed. Please try again.");
    }
  };

  return (
    <div className="modern-container">
      <Toaster />

      <div className="main-box">
        {/* --- LEFT SIDE: FORM SECTION --- */}
        <div className="form-section">
          <form onSubmit={handaleonform}>
            <h1 className="form-title">Create Account</h1>

            {/* Social Icons Placeholder (Visual only to match video) */}
            <div className="social-container">
              <span className="social-icon">G</span>
              <span className="social-icon">f</span>
              <span className="social-icon">in</span>
            </div>

            <span className="sub-text">OPTIONS COOMING SOON...</span>


            <input type="text" name="name" placeholder="Name" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="tel" name="mobilenumber" placeholder="Mobile Number" required />
            <input type="text" name="address" placeholder="Address" required />
            <input type="password" name="password" placeholder="Password" required />

            <button type="submit" className="submit-btn">Register</button>
          </form>
        </div>

        {/* --- RIGHT SIDE: WELCOME/LOGIN LINK --- */}
        <div className="toggle-section">
          <div className="toggle-content">
            <h1>Welcome Back!</h1>
            <p>Enter your personal details to use all of site features</p>
            <p><b style={{color:"#FFD700"}}>If You Have Already Register Click Login </b></p>
            <button className="ghost-btn" onClick={() => nav("/user/login")}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userregister;