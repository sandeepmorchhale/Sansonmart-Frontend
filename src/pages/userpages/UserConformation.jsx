import React, { useEffect, useState } from 'react';
import api from '../../api'; // Use your configured API instance
import { useNavigate, useLocation } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import toast, { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { MapPin, Phone, ShieldCheck, Banknote, CreditCard, Smartphone } from 'lucide-react';
import axios from 'axios';


const UserConfirmation = () => {
    const nav = useNavigate();
    const location = useLocation();
    const [userdata, setuserdata] = useState("");
    const [orderItems, setOrderItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // State to toggle payment method
    const [paymentMethod, setPaymentMethod] = useState("COD");

    useEffect(() => {
        // 1. Fetch User Profile
        api.get("/api/user/profile", { withCredentials: true })
            .then(res => setuserdata(res.data.user))
            .catch(() => nav("/user/login"));

        // 2. Fetch Cart or Direct Item
        if (location.state && location.state.directItem) {
            setOrderItems([location.state.directItem]);
        } else {
            api.get("/api/user/cart/get", { withCredentials: true })
                .then(res => setOrderItems(res.data.cart || []))
                .catch(err => console.log("Cart fetch error", err));
        }
    }, [location.state, nav]);

    const totalPrice = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // --- RAZORPAY HELPER: LOAD SCRIPT ---
    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    // --- HANDLER: ONLINE PAYMENT (RAZORPAY) ---
    const handleOnlinePayment = async () => {
        setLoading(true);
        try {
            // 1. Load Script
            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!res) {
                toast.error("Razorpay SDK failed to load.");
                setLoading(false);
                return;
            }

            // 2. Create Order on Backend (Using 'api' instance instead of raw axios)
            const result = await api.post("/api/payment/create-order", {
                amount: totalPrice,
                currency: "INR"
            });
            const { amount, id: order_id, currency } = result.data.order;

            // 3. Open Razorpay Modal
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: amount,
                currency: currency,
                name: "Sanson Mart",
                description: "Order Payment",
                order_id: order_id,
                handler: async function (response) {
                    // 4. Verify Payment & Place Order
                    const verifyPayload = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,

                        // --- Ye Line Add Karein (User ID bhejein) ---
                        userId: userdata._id,
                        // --------------------------------------------

                        orderItems,
                        shippingAddress: {
                            username: userdata.name,
                            email: userdata.email,
                            address: userdata.address,
                            mobile: userdata.mobilenumber
                        },
                        totalPrice,
                        paymentMethod: "Online",
                        isDirectPurchase: !!location.state?.directItem
                    };

                    try {
                        // FIX: Use 'api' instance and correct URL (removed typo)
                        const verifyRes = await api.post("/api/payment/verify-payment", verifyPayload);

                        if (verifyRes.data.success) {
                            toast.success("Payment Successful! Order Placed ✅");

                            // 5. Navigate immediately (Use replace: true so user can't go back)
                            setTimeout(() => {
                                nav("/user/order", { replace: true });
                            }, 1000);

                        } else {
                            toast.error("Payment Verification Failed");
                        }
                    } catch (error) {
                        console.error(error);
                        toast.error("Server Error during Verification");
                    }
                },
                prefill: {
                    name: userdata.name,
                    email: userdata.email,
                    contact: userdata.mobilenumber,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
            setLoading(false);

        } catch (err) {
            console.error(err);
            toast.error("Failed to initiate payment.");
            setLoading(false);
        }
    };

    // --- HANDLER: CASH ON DELIVERY ---
    const handleCOD = async () => {
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
                paymentMethod: "Cash on Delivery",
                isDirectPurchase: !!location.state?.directItem
            };

            const res = await api.post("/api/user/order/new", orderPayload, { withCredentials: true });
            if (res.data.success) {
                toast.success("Order Placed Successfully! ✅");

                // Navigate immediately
                setTimeout(() => {
                    nav("/user/order", { replace: true });
                }, 1000);
            }
        } catch (err) {
            toast.error("Failed to place order.");
        } finally {
            setLoading(false);
        }
    };

    // --- MAIN CONFIRM BUTTON HANDLER ---
    const handleConfirm = () => {
        if (!userdata.address || !userdata.mobilenumber) {
            return toast.error("Delivery details are missing!");
        }

        if (paymentMethod === "ONLINE") {
            handleOnlinePayment();
        } else {
            handleCOD();
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
                                <p className="mb-1 text-muted"><Phone size={14} className="me-2" />{userdata.mobilenumber}</p>
                                <p className="mb-0 text-muted"><MapPin size={14} className="me-2" />{userdata.address}</p>
                            </div>
                            <b className='px-3 text-danger mt-2 small'>If your information is incorrect, please edit it in the Account section.</b>
                        </motion.div>

                        {/* Payment Options Card */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card border-0 shadow-sm p-4" style={{ borderRadius: '24px' }}>
                            <div className="d-flex align-items-center mb-4">
                                <div className="bg-success bg-opacity-10 p-2 rounded-3 text-success me-3"><Banknote size={22} /></div>
                                <h5 className="fw-bold mb-0">Payment Method</h5>
                            </div>

                            <div className="row g-3">
                                {/* Cash on Delivery Option */}
                                <div className="col-12">
                                    <div
                                        onClick={() => setPaymentMethod("COD")}
                                        className={`border ${paymentMethod === "COD" ? "border-success bg-success bg-opacity-10" : "border-light bg-white"} border-2 p-3 rounded-4 d-flex align-items-center justify-content-between`}
                                        style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <Banknote className={paymentMethod === "COD" ? "text-success me-3" : "text-muted me-3"} />
                                            <div>
                                                <p className="mb-0 fw-bold">Cash On Delivery</p>
                                                <small className="text-muted">Pay when you receive your order</small>
                                            </div>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" checked={paymentMethod === "COD"} readOnly />
                                        </div>
                                    </div>
                                </div>

                                {/* Online Payment Option (Razorpay) */}
                                <div className="col-12">
                                    <div
                                        onClick={() => setPaymentMethod("ONLINE")}
                                        className={`border ${paymentMethod === "ONLINE" ? "border-primary bg-primary bg-opacity-10" : "border-light bg-white"} border-2 p-3 rounded-4 d-flex align-items-center justify-content-between`}
                                        style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="d-flex me-3 text-muted">
                                                <Smartphone className="me-1" />
                                                <CreditCard />
                                            </div>
                                            <div>
                                                <p className="mb-0 fw-bold">Pay Online</p>
                                                <small className="text-muted">UPI, Cards, Net Banking (Razorpay)</small>
                                            </div>
                                        </div>
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" checked={paymentMethod === "ONLINE"} readOnly />
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
                                className={`btn w-100 py-3 fw-bold shadow border-0 ${paymentMethod === "ONLINE" ? "btn-info text-white" : "btn-primary"}`}
                                onClick={handleConfirm}
                                disabled={loading || orderItems.length === 0}
                                style={{ borderRadius: '16px' }}
                            >
                                {loading ? (
                                    <span className="spinner-border spinner-border-sm"></span>
                                ) : (
                                    paymentMethod === "ONLINE" ? "Pay Now (Online)" : "Place Order (COD)"
                                )}
                            </button>
                            <div className="text-center mt-3">
                                <small className="text-muted"><ShieldCheck size={14} className="me-1 text-success" /> Secure & Safe Checkout</small>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserConfirmation;