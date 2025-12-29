import React, { useEffect, useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import Usernavbar from './Usernavbar';
import toast, { Toaster } from 'react-hot-toast';

const UserProductPage = () => {
    const nav = useNavigate();
    const [productdata, setproductdata] = useState([]);
    const [quantities, setQuantities] = useState({});

    useEffect(() => {
        api.get("/api/user/products", { withCredentials: true })
            .then((res) => {
                setproductdata(res.data.products);
                const initialQs = {};
                res.data.products.forEach(p => initialQs[p._id] = 1);
                setQuantities(initialQs);
            })
            .catch((err) => console.log("no products find ", err));
    }, []);

    const handleBuyNow = (product) => {
        const singleProductData = {
            product: product._id,
            name: product.name,
            price: product.price,
            image: product.img,
            quantity: quantities[product._id] || 1,
            isDirectBuy: true
        };
        nav("/user/conformation", { state: { directItem: singleProductData } });
    };

    const updateQty = (id, delta, stock) => {
        setQuantities(prev => {
            const newQty = (prev[id] || 1) + delta;
            if (newQty > 0 && newQty <= stock) {
                return { ...prev, [id]: newQty };
            }
            return prev;
        });
    };

    const handleAddToCart = async (product) => {
        try {
            const res = await api.post("/api/user/cart/add", {
                product: product._id,
                name: product.name,
                price: product.price,
                image: product.img,
                quantity: quantities[product._id] || 1
            }, { withCredentials: true });

            if (res.data.success) {
                toast.success("Item Added Your Cart Section", {
                    duration: 3000,
                    position: 'bottom-right',
                });
            }
        } catch (err) {
            alert("Login required!");
        }

    };

    return (
        <>
            <Toaster />
            <Usernavbar />
            <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
                <div className="container py-5">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold text-dark display-5">Premium Farm Collection</h2>
                        <div className="mx-auto bg-success mb-2" style={{ height: '4px', width: '60px' }}></div>
                        <p className="text-muted">Directly sourced high-quality products for your health</p>
                    </div>

                    <div className="row g-4 justify-content-center">
                        {productdata.map((item) => (
                            <div key={item._id} className="col-12 col-xl-10">
                                <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: '25px' }}>
                                    <div className="row g-0">
                                        {/* Left: Image Section */}
                                        <div className="col-md-5 bg-white d-flex align-items-center justify-content-center p-4">
                                            <div className="position-relative">
                                                <img src={item.img} alt={item.name} className="img-fluid transition-img" style={{ maxHeight: '320px', borderRadius: '20px', objectFit: 'cover' }} />
                                                <div className="position-absolute top-0 start-0 m-2">
                                                    <span className="badge bg-success shadow-sm px-3 py-2">Fresh</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Content Section */}
                                        <div className="col-md-7 p-4 bg-white border-start">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h3 className="fw-bold text-dark text-capitalize mb-0">{item.name}</h3>
                                                <span className="fs-3 fw-bold text-success">₹{item.price}<small className="fs-6 text-muted font-monospace">/Kg</small></span>
                                            </div>

                                            <div className="d-flex align-items-center mb-3 text-muted">
                                                <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                                                <span className="small fw-semibold">{item.village} Organic Farms</span>
                                            </div>

                                            {/* Product Details Grid */}
                                            <div className="row g-3 mb-4">
                                                <div className="col-6 col-sm-4">
                                                    <div className="p-2 border rounded-3 bg-light-subtle">
                                                        <small className="text-muted d-block">Variety</small>
                                                        <span className="fw-bold small text-dark">{item.veriety || "Standard"}</span>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4">
                                                    <div className="p-2 border rounded-3 bg-light-subtle">
                                                        <small className="text-muted d-block">Packaging</small>
                                                        <span className="fw-bold small text-dark">{item.packaging || "Safe Pack"}</span>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4">
                                                    <div className="p-2 border rounded-3 bg-light-subtle">
                                                        <small className="text-muted d-block">Available Stock</small>
                                                        <span className={`fw-bold small ${item.stock < 10 ? 'text-danger' : 'text-success'}`}>{item.stock} Kg</span>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <div className="p-2 border rounded-3 bg-light-subtle">
                                                        <small className="text-muted d-block text-center mb-1">Contact Farmer</small>
                                                        <div className="text-center fw-bold text-primary">
                                                            <i className="bi bi-telephone-fill me-2"></i>{item.contact || "9876543210"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>



                                            <h6 className="fw-bold mb-2">Description</h6>
                                            <p className="text-secondary small mb-4" style={{ textAlign: 'justify', lineHeight: '1.6' }}>
                                                {item.description || "This premium quality product is grown using traditional methods without harmful chemicals, ensuring the best taste and nutrition for your family."}
                                            </p>

                                            {/* Actions Section */}
                                            <div className="row g-3 align-items-center">
                                                <div className="col-12 col-md-4">
                                                    <div className="d-flex align-items-center border rounded-pill overflow-hidden bg-light shadow-sm">
                                                        <button onClick={() => updateQty(item._id, -1, item.stock)} className="btn btn-light border-0 px-3 fw-bold">—</button>
                                                        <span className="flex-grow-1 text-center fw-bold text-dark">{quantities[item._id] || 1}</span>
                                                        <button onClick={() => updateQty(item._id, 1, item.stock)} className="btn btn-light border-0 px-3 fw-bold">+</button>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-md-4">
                                                    <button onClick={() => handleAddToCart(item)} className="btn btn-outline-dark w-100 fw-bold py-2 rounded-pill transition-btn">
                                                        <i className="bi bi-cart-plus me-2"></i>Cart
                                                    </button>
                                                </div>
                                                <div className="col-6 col-md-4">
                                                    <button onClick={() => handleBuyNow(item)} className="btn btn-success w-100 fw-bold py-2 rounded-pill shadow-sm transition-btn">
                                                        Buy Now
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Simple CSS for animations */}
                <style>{`
                .transition-img { transition: transform 0.3s ease; }
                .card:hover .transition-img { transform: scale(1.03); }
                .transition-btn:hover { opacity: 0.9; transform: translateY(-1px); }
                .bg-light-subtle { background-color: #fcfdfd !important; }
            `}</style>
            </div>
        </>

    );
};

export default UserProductPage;