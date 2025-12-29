import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import logo from "../../images/userimage/logo.png";
import api from '../../api';

const Usernavbar = () => {
    const nav = useNavigate();
    const location = useLocation();
    const collapseRef = useRef(null); // Ref for closing menu on mobile

    const [userdata, setuserdata] = useState("");
    const [showProfile, setShowProfile] = useState(false);
    
    // Address Edit States
    const [isEditingAddress, setIsEditingAddress] = useState(false);
    const [newAddress, setNewAddress] = useState("");

    // Mobile Edit States
    const [isEditingMobile, setIsEditingMobile] = useState(false);
    const [newMobile, setNewMobile] = useState("");

    useEffect(() => {
        fetchUserProfile();
    }, []);

    const fetchUserProfile = () => {
        api.get("/api/user/profile", { withCredentials: true })
            .then((res) => {
                setuserdata(res.data.user);
                setNewAddress(res.data.user.address);
                setNewMobile(res.data.user.mobilenumber); 
            })
            .catch((err) => {
                console.log("Please login first", err);
                // Optional: redirect only if absolutely necessary logic requires it
                // nav("/user/login"); 
            });
    };

    const handleUpdateProfile = async (field) => {
        try {
            const updateData = field === 'address' ? { address: newAddress } : { mobilenumber: newMobile };
            
            const res = await api.put("/api/user/update-userdata", 
                updateData, 
                { withCredentials: true }
            );
            
            if (res.status === 200) {
                setuserdata({ ...userdata, ...updateData });
                field === 'address' ? setIsEditingAddress(false) : setIsEditingMobile(false);
                // Used a simple alert here, but a toast notification would be better in production
                alert(`${field === 'address' ? 'Address' : 'Mobile number'} updated successfully!`);
            }
        } catch (error) {
            console.error("Update error:", error);
            alert("Update failed");
        }
    };

    const logout = async () => {
      
         try {
            const res = await api.post("/api/auth/user/logout", {
                credentials: "include",
            });
            if (res.status === 200) {
                nav("/");
            }
        } catch (error) {
            console.log("Logout error:", error);
        }


    };

    // Helper to close navbar on mobile when a link is clicked
    const handleNavClick = (path) => {
        // Navigate
        if(path) nav(path);
        
        // Close Bootstrap Collapse
        if (window.innerWidth < 992) {
            const bsCollapse = document.getElementById('mainNav');
            if (bsCollapse && bsCollapse.classList.contains('show')) {
                bsCollapse.classList.remove('show');
            }
        }
    };

    // Helper for active class
    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav style={{zIndex:999999999}} className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark py-3 custom-navbar">
                <div className="container">
                    {/* --- Logo --- */}
                    <div 
                        onClick={() => handleNavClick("/user/product")} 
                        className="navbar-brand d-flex align-items-center" 
                        style={{cursor: 'pointer'}}
                    >
                        <img src={logo} alt="logo" height="45" className="me-2" />
                    </div>
                    
                    {/* --- Toggler --- */}
                    <button className="navbar-toggler border-0 shadow-none" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    
                    {/* --- Menu Items --- */}
                    <div className="collapse navbar-collapse mt-3 mt-lg-0" id="mainNav" ref={collapseRef}>
                        <ul className="navbar-nav mx-auto mb-3 mb-lg-0 gap-1 gap-lg-4 text-center">
                            {[
                                { name: "Home", path: "/" },
                                { name: "Products", path: "/user/product" },
                                { name: "My Cart", path: "/user/cart" },
                                { name: "My Orders", path: "/user/order" },
                                { name: "Support", path: "/user/chat" }
                            ].map(link => (
                                <li className="nav-item" key={link.path}>
                                    <button 
                                        onClick={() => handleNavClick(link.path)} 
                                        className={`nav-link fw-medium bg-transparent border-0 w-100 ${isActive(link.path) ? 'active-link' : ''}`}
                                    >
                                        {link.name}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* --- Profile Section --- */}
                        <div className="d-flex justify-content-center justify-content-lg-end">
                            <div className="position-relative profile-container">
                                {/* Profile Button */}
                                <div 
                                    onClick={() => setShowProfile(!showProfile)} 
                                    className="d-flex align-items-center gap-2 border border-secondary rounded-pill px-3 py-1 profile-trigger" 
                                >
                                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style={{ width: '32px', height: '32px' }}>
                                        {userdata?.name ? userdata.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="text-white small d-inline-block">Account</span>
                                </div>

                                {/* Profile Dropdown / Modal */}
                                {showProfile && (
                                    <>
                                        {/* Backdrop to close modal */}
                                        <div className="fixed-top vh-100" onClick={() => setShowProfile(false)} style={{ zIndex: 1040 }}></div>
                                        
                                        {/* The Card */}
                                        <div className="profile-dropdown-card bg-white text-dark rounded-4 shadow-lg p-4">
                                            {/* Header */}
                                            <div className="text-center mb-3">
                                                <div className="bg-light rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                                                    <span className="display-6 text-primary fw-bold">{userdata?.name?.charAt(0).toUpperCase()}</span>
                                                </div>
                                                <h6 className="mb-0 fw-bold text-truncate" style={{maxWidth: "200px", margin: "0 auto"}}>{userdata.name}</h6>
                                                <small className="text-muted text-truncate d-block" style={{maxWidth: "220px", margin: "0 auto"}}>{userdata.email}</small>
                                            </div>

                                            <div className="border-top pt-3">
                                                <div className="d-flex flex-column gap-3 small">
                                                    
                                                    {/* MOBILE EDIT */}
                                                    <div>
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <span className="text-muted fw-bold">Mobile:</span>
                                                            <button className="btn btn-link btn-sm text-decoration-none p-0" onClick={() => setIsEditingMobile(!isEditingMobile)}>
                                                                {isEditingMobile ? 'Cancel' : 'Edit'}
                                                            </button>
                                                        </div>
                                                        {isEditingMobile ? (
                                                            <div className="animate-fade">
                                                                <input 
                                                                    type="text"
                                                                    className="form-control form-control-sm mb-2"
                                                                    value={newMobile}
                                                                    onChange={(e) => setNewMobile(e.target.value)}
                                                                />
                                                                <button className="btn btn-primary btn-sm w-100 rounded-pill" onClick={() => handleUpdateProfile('mobile')}>Save</button>
                                                            </div>
                                                        ) : (
                                                            <span className="d-block bg-light p-2 rounded">{userdata.mobilenumber || "Not Set"}</span>
                                                        )}
                                                    </div>

                                                    {/* ADDRESS EDIT */}
                                                    <div>
                                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                                            <span className="text-muted fw-bold">Address:</span>
                                                            <button className="btn btn-link btn-sm text-decoration-none p-0" onClick={() => setIsEditingAddress(!isEditingAddress)}>
                                                                {isEditingAddress ? 'Cancel' : 'Edit'}
                                                            </button>
                                                        </div>
                                                        {isEditingAddress ? (
                                                            <div className="animate-fade">
                                                                <textarea 
                                                                    className="form-control form-control-sm mb-2"
                                                                    value={newAddress}
                                                                    onChange={(e) => setNewAddress(e.target.value)}
                                                                    rows="2"
                                                                />
                                                                <button className="btn btn-primary btn-sm w-100 rounded-pill" onClick={() => handleUpdateProfile('address')}>Save</button>
                                                            </div>
                                                        ) : (
                                                            <span className="d-block bg-light p-2 rounded text-wrap" style={{maxHeight: '80px', overflowY: 'auto'}}>
                                                                {userdata.address || "Not Set"}
                                                            </span>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                            <button onClick={logout} className="btn btn-outline-danger btn-sm w-100 mt-4 rounded-pill fw-bold">Log Out</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <style>{`
                /* Navbar Base */
                .custom-navbar {
                    border-bottom: 1px solid #333;
                    background: rgba(33, 37, 41, 0.98) !important;
                }

                .profile-trigger {
                    cursor: pointer;
                    background: #222;
                    transition: all 0.2s;
                }
                .profile-trigger:hover {
                    background: #333;
                    border-color: #555 !important;
                }

                /* Active Link Styles */
                .nav-link {
                    color: rgba(255,255,255,0.55);
                    transition: all 0.3s;
                }
                .nav-link:hover {
                    color: #fff;
                }

                /* Mobile View Improvements (Under 992px) */
                @media (max-width: 991.98px) {
                    .nav-link {
                        padding: 10px;
                        border-radius: 8px;
                    }
                    .active-link {
                        background-color: #0d6efd;
                        color: white !important;
                        font-weight: bold;
                    }
                    
                    /* Center the profile card on mobile */
                    .profile-dropdown-card {
                        position: fixed !important;
                        top: 50% !important;
                        left: 50% !important;
                        transform: translate(-50%, -50%);
                        width: 90% !important;
                        max-width: 350px;
                        z-index: 1050;
                        animation: popIn 0.3s ease;
                    }
                }

                /* Desktop View (Over 992px) */
                @media (min-width: 992px) {
                    .active-link {
                        color: #0d6efd !important;
                        position: relative;
                    }
                    .active-link::after {
                        content: '';
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        width: 100%;
                        height: 2px;
                        background: #0d6efd;
                    }
                    
                    /* Dropdown positioning for Desktop */
                    .profile-dropdown-card {
                        position: absolute;
                        top: 140%;
                        right: 0;
                        width: 300px;
                        z-index: 1050;
                        animation: slideDown 0.2s ease;
                    }
                }

                /* Animations */
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes popIn {
                    from { opacity: 0; transform: translate(-50%, -45%); }
                    to { opacity: 1; transform: translate(-50%, -50%); }
                }
                .animate-fade {
                    animation: fadeIn 0.3s;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </>
    );
};

export default Usernavbar;