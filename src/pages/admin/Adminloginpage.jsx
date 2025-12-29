import api from '../../api';
import React from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../../CSS/AdminCss/Adminlogin.css'

const Adminloginpage = () => {

    const nav = useNavigate()

    const adminloginsubmit = async (e) => {
        e.preventDefault();

        const email = e.target.email.value
        const password = e.target.password.value

        try {

            const res = await api.post("/api/admin/login", { email, password }, { withCredentials: true })

            if (res.data.message === "Admin login successful") {

                toast.success("Welcome To Admin Panal Sandeep", {
                    duration: 3000,
                    position: "bottom-right"

                })

                setTimeout(() => {
                    nav("/admin/deshboard")

                }, 2000);
            }
            else {
                alert("invailid user id and password ")
            }

        } catch (error) {

            toast.error("invailid user id and password ")
            console.log("api is not run", error)
        }

    }
    return (
        <>
            <Toaster />

        
            <div className="admin-login-wrapper">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6 col-lg-5 col-xl-4">
                            
                            <div className="card login-card bg-white p-4">
                                <div className="card-body">
                                    
                                    {/* --- Header Section with Icon --- */}
                                    <div className="text-center mb-4">
                                        <div className="icon-box">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-shield-lock-fill" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5z"/>
                                            </svg>
                                        </div>
                                        <h3 className="fw-bold text-dark mb-1">Admin Portal</h3>
                                        <p className="text-muted small">Secure Access Dashboard</p>
                                    </div>

                                    {/* --- Login Form --- */}
                                    <form onSubmit={adminloginsubmit}>
                                        
                                        {/* Email Input */}
                                        <div className="form-floating mb-3">
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                id="email"
                                                placeholder="name@example.com"
                                                required
                                            />
                                            <label htmlFor="email">Email Address</label>
                                        </div>

                                        {/* Password Input */}
                                        <div className="form-floating mb-4">
                                            <input
                                                type="password"
                                                name="password"
                                                className="form-control"
                                                id="password"
                                                placeholder="Password"
                                                required
                                            />
                                            <label htmlFor="password">Password</label>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="d-grid">
                                            <button type="submit" className="btn btn-primary btn-admin-login">
                                                Login System
                                            </button>
                                        </div>

                                    </form>

                                    {/* Footer / Copyright */}
                                    <div className="text-center mt-4 pt-2 border-top">
                                        <small className="text-muted opacity-75">
                                            &copy; {new Date().getFullYear()} Admin Security Systems
                                        </small>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Adminloginpage