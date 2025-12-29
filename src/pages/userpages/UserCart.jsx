import React, { useEffect, useState } from 'react';
import api from '../../api';


import { useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';

const UserCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigate();

    // 1. Database se cart fetch karna
    const fetchCart = async () => {
        try {
            const res = await api.get("/api/user/cart/get", { withCredentials: true });
            if (res.data.success) {
                setCartItems(res.data.cart);
            }
        } catch (err) {
            console.error("Cart fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    // 2. Item Delete karne ka function
    const removeItem = async (productId) => {
        if (window.confirm("Are you sure you want to remove this item?")) {
            try {
                const res = await api.delete(`/api/user/cart/remove/${productId}`, { withCredentials: true });
                if (res.data.success) {
                    // UI se turant hatane ke liye state filter karein
                    setCartItems(cartItems.filter(item => item.product !== productId));
                }
            } catch (err) {
                alert("Could not remove item. Please try again.");
            }
        }
    };

    // 3. Total Calculation
    const calculateTotal = () => {
        return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    };

    if (loading) {
        return (
            <>
                <Usernavbar />
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                    <div className="spinner-border text-success" role="status"></div>
                </div>
            </>
        );
    }

    return (
        <>
            <Usernavbar />
            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

                <div className="container py-4 py-md-5">
                    <div className="d-flex align-items-center mb-4">
                        <button onClick={() => nav(-1)} className="btn btn-light rounded-circle me-3 shadow-sm">
                            ←
                        </button>
                        <h2 className="fw-bold mb-0">Your Shopping Cart 🛒</h2>
                    </div>

                    {cartItems.length === 0 ? (
                        <div className="card border-0 shadow-sm p-5 text-center" style={{ borderRadius: '20px' }}>
                            <div className="mb-4">
                                <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
                            </div>
                            <h4 className="text-muted">Your cart is feeling a bit light!</h4>
                            <p className="mb-4">Add some fresh farm products to your cart.</p>
                            <button className="btn btn-success px-4 py-2 fw-bold" onClick={() => nav("/user/product")}>
                                Start Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="row g-4">
                            {/* Cart Items List */}
                            <div className="col-lg-8">
                                {cartItems.map((item) => (
                                    <div key={item.product} className="card border-0 shadow-sm mb-3 p-3 position-relative" style={{ borderRadius: '15px' }}>
                                        {/* Delete Button */}
                                        <button
                                            onClick={() => removeItem(item.product)}
                                            className="btn btn-outline-danger btn-sm position-absolute border-0 shadow-sm"
                                            style={{ top: '15px', right: '15px', borderRadius: '10px' }}
                                            title="Remove Item"
                                        >
                                            Delete
                                        </button>

                                        <div className="row align-items-center">
                                            <div className="col-4 col-md-3 col-lg-2">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded-3 shadow-sm"
                                                    style={{ objectFit: 'cover', height: '80px', width: '100%' }}
                                                />
                                            </div>
                                            <div className="col-8 col-md-5 col-lg-6">
                                                <h5 className="fw-bold mb-1 text-capitalize">{item.name}</h5>
                                                <p className="text-muted small mb-0">Price: ₹{item.price} / unit</p>
                                                <p className="text-success fw-bold d-md-none mb-0">Total: ₹{item.price * item.quantity}</p>
                                            </div>
                                            <div className="col-12 col-md-4 col-lg-4 mt-3 mt-md-0 d-flex justify-content-between align-items-center">
                                                <div className="bg-light px-3 py-1 rounded-pill border">
                                                    <small className="text-muted">Qty:</small> <span className="fw-bold">{item.quantity}</span>
                                                </div>
                                                <div className="text-end d-none d-md-block">
                                                    <h6 className="fw-bold text-success mb-0">₹{item.price * item.quantity}</h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="col-lg-4">
                                <div className="card border-0 shadow-sm p-4 sticky-top" style={{ borderRadius: '20px', top: '20px' }}>
                                    <h4 className="fw-bold mb-4">Price Details</h4>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">Price ({cartItems.length} items)</span>
                                        <span>₹{calculateTotal()}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-3">
                                        <span className="text-muted">Delivery Charges</span>
                                        <span className="text-success">FREE</span>
                                    </div>
                                    <hr />
                                    <div className="d-flex justify-content-between mb-4">
                                        <h5 className="fw-bold">Total Amount</h5>
                                        <h5 className="fw-bold text-success">₹{calculateTotal()}</h5>
                                    </div>
                                    <button
                                        className="btn btn-warning w-100 fw-bold py-3 shadow-sm mb-3"
                                        style={{ borderRadius: '12px' }}
                                        onClick={() => nav("/user/conformation")}
                                    >
                                        Proceed to Checkout
                                    </button>
                                    <div className="text-center">
                                        <small className="text-muted">Safe and Secure Payments</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>

    );
};

export default UserCart;