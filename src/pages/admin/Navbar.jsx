import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useNavigate, useLocation } from "react-router-dom";
import img1 from "../../images/userimage/logo.png";
import api from '../../api'

const Navbar = () => {
    const nav = useNavigate();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? "text-primary border-bottom border-primary border-2" : "text-secondary";

    const adminlogout = async () => {
        try {
            const res = await api.post("/api/admin/logout", {

                credentials: "include",
            });
            if (res.status === 200) {
                nav("/");
            }
        } catch (error) {
            console.log("Logout error:", error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-dark sticky-top py-2 border-bottom shadow-sm">
            <div className="container">

                {/* Logo & Brand */}
                <div
                    className="navbar-brand d-flex align-items-center gap-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => nav("/admin/deshboard")}
                >
                    <img
                        src={img1}
                        alt="logo"
                        width="50"
                        height="50"
                        className="object-fit-contain"
                    />
                    <span className="fw-bold tracking-tight text-white d-none d-sm-block">
                        ADMIN PANEL
                    </span>
                </div>

                {/* Mobile Toggle Button - FIXED: Added navbar-dark class for white icon */}
                <button
                    className="navbar-toggler border-0 shadow-none navbar-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#mainNav"
                    aria-controls="mainNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* Main Navigation Menu */}
                <div className="collapse navbar-collapse" id="mainNav">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li className="nav-item px-2">
                            <button
                                onClick={() => nav("/admin/deshboard")}
                                className={`nav-link fw-semibold transition-all bg-transparent border-0 ${isActive("/admin/deshboard")}`}
                            >
                                Dashboard
                            </button>
                        </li>
                        <li className="nav-item px-2">
                            <button
                                onClick={() => nav("/admin/listings")}
                                className={`nav-link fw-semibold transition-all bg-transparent border-0 ${isActive("/admin/listings")}`}
                            >
                                My Listings
                            </button>
                        </li>
                        <li className="nav-item px-2">
                            <button
                                onClick={() => nav("/admin/message")}
                                className={`nav-link fw-semibold transition-all bg-transparent border-0 ${isActive("/admin/message")}`}
                            >
                                Messages
                            </button>
                        </li>
                        <li className="nav-item px-2">
                            <button
                                onClick={() => nav("/admin/orders")}
                                className={`nav-link fw-semibold transition-all bg-transparent border-0 ${isActive("/admin/orders")}`}
                            >
                                Orders
                            </button>
                        </li>
                    </ul>

                    {/* Logout Button wrapper for alignment */}
                    <div className="d-flex justify-content-center">
                        <button
                            onClick={adminlogout}
                            className="btn btn-outline-danger btn-sm px-4 rounded-pill fw-bold shadow-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .nav-link {
                    padding-bottom: 5px !important;
                    transition: color 0.3s ease;
                }
                .nav-link:hover {
                    color: #0d6efd !important;
                }
                .transition-all {
                    transition: all 0.3s ease;
                }
                /* Ensure toggle icon is visible on dark background */
                .navbar-toggler-icon {
                    filter: invert(1);
                }
            `}</style>
        </nav>
    );
};

export default Navbar;