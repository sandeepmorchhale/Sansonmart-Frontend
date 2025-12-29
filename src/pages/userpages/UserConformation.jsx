import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate, useLocation } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MapPin, Phone, User, PackageCheck, ArrowRight, ShieldCheck, Banknote, CreditCard, Smartphone } from 'lucide-react';

const UserConfirmation = () => {
    const nav = useNavigate();
    const location = useLocation();
    const [userdata, setuserdata] = useState("");
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Default payment method
    const [paymentMethod, setPaymentMethod] = useState("COD");

    useEffect(() => {
        api.get("/api/user/profile", { withCredentials: true })
            .then(res => setuserdata(res.data.user))
            .catch(() => nav("/user/login"));

        if (location.state && location.state.directItem) {
            setOrderItems([location.state.directItem]);
        } else {
            api.get("/api/user/cart/get", { withCredentials: true })
                .then(res => setOrderItems(res.data.cart || []))
                .catch(err => console.log("Cart fetch error", err));
        }
    }, [location.state, nav]);

    const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
console.log("uhu",userdata)
    const handleConfirm = async () => {
        if (!userdata.address || !userdata.mobilenumber) {
            return toast.error("Delivery details are missing!");
        }
        setLoading(true);
        try {
            const orderPayload = {
                orderItems,
                shippingAddress: {

                    username: userdata.name,
                    email: userdata.email,
                    address: userdata.address,
                    mobile: userdata.mobilenumber
                },
                totalPrice,
                paymentMethod: "Cash on Delivery", // Explicitly passing COD
                isDirectPurchase: !!location.state?.directItem
            };

            const res = await api.post("/api/user/order/new", orderPayload, { withCredentials: true });
            if (res.data.success) {
                toast.success("Order Placed Successfully! ✅");
                setTimeout(() => nav("/user/order"), 2000);
            }
        } catch (err) {
            toast.error("Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 pb-5">
            <Toaster position="top-center" />
            <Usernavbar />

            <div className="container py-5">
                <div className="row g-4">
                    {/* Left Column: Details & Payment */}
                    <div className="col-lg-7">
                        
                        {/* Shipping Address Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card border-0 shadow-sm p-4 mb-4" style={{ borderRadius: '24px' }}>
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-primary bg-opacity-10 p-2 rounded-3 text-primary me-3"><MapPin size={22} /></div>
                                <h5 className="fw-bold mb-0">Delivery Address</h5>
                            </div>
                            <div className="p-3 bg-light rounded-4">
                                <p className="mb-1 fw-bold">{userdata.name}</p>
                                <p className="mb-1 text-muted"><Phone size={14} className="me-2"/>{userdata.mobilenumber}</p>
                                <p className="mb-0 text-muted"><MapPin size={14} className="me-2"/>{userdata.address}</p>
                            </div>
                            <b className='px-3 text-danger'>If Your Information Are Wrong Please Go To Account Section And Edit Information</b>
                        </motion.div>

                        {/* Payment Options Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card border-0 shadow-sm p-4" style={{ borderRadius: '24px' }}>
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success me-3"><Banknote size={22} /></div>
                                <h5 className="fw-bold mb-0">Payment Method</h5>
                            </div>

                            <div className="row g-3">
                                {/* Cash on Delivery - ACTIVE */}
                                <div className="col-12">
                                    <div className="border border-success border-2 p-3 rounded-4 d-flex align-items-center justify-content-between bg-success bg-opacity-10" style={{ cursor: 'pointer' }}>
                                        <div className="d-flex align-items-center">
                                            <Banknote className="text-success me-3" />
                                            <div>
                                                <p className="mb-0 fw-bold">Cash On Delivery</p>
                                                <small className="text-muted">Pay when you receive your order</small>
                                            </div>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" checked readOnly />
                                        </div>
                                    </div>
                                </div>

                                {/* UPI - COMING SOON */}
                                <div className="col-md-6">
                                    <div className="border p-3 rounded-4 d-flex align-items-center justify-content-between bg-light opacity-75">
                                        <div className="d-flex align-items-center text-muted">
                                            <Smartphone className="me-3" />
                                            <div>
                                                <p className="mb-0 fw-bold">UPI / PhonePe</p>
                                                <span className="badge bg-secondary-subtle text-dark border">Coming Soon</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CARD - COMING SOON */}
                                <div className="col-md-6">
                                    <div className="border p-3 rounded-4 d-flex align-items-center justify-content-between bg-light opacity-75">
                                        <div className="d-flex align-items-center text-muted">
                                            <CreditCard className="me-3" />
                                            <div>
                                                <p className="mb-0 fw-bold">Debit / Credit Card</p>
                                                <span className="badge bg-secondary-subtle text-dark border">Coming Soon</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="col-lg-5">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card border-0 shadow-lg p-4 sticky-top" style={{ borderRadius: '24px', top: '100px' }}>
                            <h5 className="fw-bold mb-4">Order Summary</h5>
                            <div className="mb-4" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {orderItems.map((item, index) => (
                                    <div key={index} className="d-flex justify-content-between mb-3 border-bottom pb-2">
                                        <div>
                                            <p className="mb-0 fw-bold small">{item.name}</p>
                                            <small className="text-muted">Qty: {item.quantity}</small>
                                        </div>
                                        <span className="fw-bold">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-light p-3 rounded-4 mb-4">
                                <div className="d-flex justify-content-between mb-2 small">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2 small">
                                    <span>Delivery</span>
                                    <span className="text-success fw-bold">FREE</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between fw-bold fs-5 text-primary">
                                    <span>Total:</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                            </div>

                            <button
                                className="btn btn-primary w-100 py-3 fw-bold shadow border-0"
                                onClick={handleConfirm}
                                disabled={loading || orderItems.length === 0}
                                style={{ borderRadius: '16px' }}
                            >
                                {loading ? <span className="spinner-border spinner-border-sm"></span> : "Place Order (COD)"}
                            </button>
                            <div className="text-center mt-3">
                                <small className="text-muted"><ShieldCheck size={14} className="me-1 text-success"/> Secure & Safe Checkout</small>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserConfirmation;