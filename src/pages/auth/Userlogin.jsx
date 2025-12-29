import React from 'react';
import api from '../../../src/api';


import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../../CSS/usercss/Userlogin.css';

const Userlogin = () => {
    const nav = useNavigate();

    const handaleuserlogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        try {
            const res = await api.post(
                "/api/auth/user/login",
                { email, password },
                { withCredentials: true }
            );
            if (res.data.message === "login successfully") {
                toast.success("Welcome To Your Dashboard", {
                    duration: 3000,
                    position: 'bottom-right',
                });
                setTimeout(() => {
                    nav("/user/product");
                },1000);
            } else {
                toast.error("Server Problem Please Try Again");
            }
        } catch (err) {
            toast.error("Invalid Email or Password");
        }
    }

    return (
        <div className="modern-login-container">
            <Toaster />

            <div className="login-main-box">

                {/* --- LEFT SIDE: WELCOME PANEL (Blue) --- */}
                {/* Ye pehle aata hai taaki "Slide" ka illusion mile */}
                <div className="login-toggle-section">
                    <div className="toggle-content">
                        <h1>Hello, Friend!</h1>
                        <p>Register with your personal details to use all of site features</p>
                         <p><b style={{color:"#FFD700"}}>If You Don't Register Click Register </b></p>
                        <button
                            className="ghost-btn"
                            onClick={() => nav("/user/register")}
                        >
                            Register
                        </button>
                    </div>
                </div>

                {/* --- RIGHT SIDE: LOGIN FORM (White) --- */}
                <div className="login-form-section">
                    <form onSubmit={handaleuserlogin}>
                        <h1 className="form-title">Sign In</h1>

                        <div className="social-container">
                            <span className="social-icon">G</span>
                            <span className="social-icon">f</span>
                            <span className="social-icon">in</span>
                        </div>

                        <span className="sub-text"> OPTIONS COOMING SOON...</span>

                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="Email"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Password"
                            required
                        />

                        <div className="forgot-pass">Forgot Your Password?</div>

                        <button type="submit" className="submit-btn">LogIn</button>
                    </form>
                </div>

            </div>
        </div>
    );
}

export default Userlogin;