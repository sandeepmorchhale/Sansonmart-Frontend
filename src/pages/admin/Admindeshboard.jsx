import React, { useState } from 'react';
import '../../CSS/AdminCss/Admindeshboard.css';
import api from '../../api';

import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Admindeshboard = () => {
    const nav = useNavigate();
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const submitproduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', e.target.name.value);
        formData.append('stock', e.target.stock.value);
        formData.append('village', e.target.village.value);
        formData.append('price', e.target.price.value);
        formData.append('packaging', e.target.packaging.value);
        formData.append('contact', e.target.contact.value);
        formData.append('description', e.target.description.value);
        formData.append('veriety', e.target.veriety.value);

        if (e.target.img.files[0]) {
            formData.append('img', e.target.img.files[0]);
        }

        try {
            await api.post(
                "/api/admin/products",
                formData,
                {
                    withCredentials: true,
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );
            alert("Product successfully added!");
            setPreview(null);
            e.target.reset();
            nav("/admin/listings"); // Upload ke baad listings par bhej dega
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Failed to add product.");
        }
    };

    return (
        <>
            <Navbar />
            <div className="udpage village-bg py-lg-5 py-4">
                <div className="container">
                    <header className="row align-items-center mb-4 text-center text-md-start">
                        <div className="col-md-7">
                            <h2 className="fw-bold text-dark mb-1">Welcome back, Sandeep 👋</h2>
                            <p className="text-muted">Create a new butter oil listing.</p>
                        </div>
                    </header>

                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-xl-9">
                            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                                <div className="card-header bg-primary py-3 px-4 text-white">
                                    <h5 className="mb-0"><i className="bi bi-plus-circle me-2"></i>Create New Listing</h5>
                                </div>
                                <div className="card-body p-4 p-md-5 bg-white">
                                    <form onSubmit={submitproduct}>
                                        <div className="row g-4">
                                            <div className="col-md-8">
                                                <label className="form-label fw-semibold">Product Name</label>
                                                <input className="form-control custom-input" type="text" name="name" required />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">Variety</label>
                                                <select name="veriety" className="form-select custom-input">
                                                    <option value="BUFFALO">BUFFALO</option>
                                                    <option value="COW">COW</option>
                                                </select>
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">Quantity (kg)</label>
                                                <input className="form-control custom-input" type="number" name="stock" required />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">Price per kg (₹)</label>
                                                <input className="form-control custom-input" type="number" name="price" required />
                                            </div>
                                            <div className="col-md-4">
                                                <label className="form-label fw-semibold">Contact</label>
                                                <input className="form-control custom-input" type="tel" name="contact" required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Village</label>
                                                <input className="form-control custom-input" type="text" name="village" required />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">Packaging</label>
                                                <select name="packaging" className="form-select custom-input">
                                                    <option>Glass Jar</option>
                                                    <option>Plastic Bottle</option>
                                                </select>
                                            </div>
                                            <div className="col-12 text-center">
                                                <label className="form-label fw-semibold d-block text-start">Product Image</label>
                                                <input className="form-control custom-input" type="file" name="img" accept="image/*" onChange={handleFileChange} required />
                                                {preview && <img src={preview} alt="Preview" className="mt-3 rounded shadow" style={{ height: '150px', width: '200px', objectFit: 'cover' }} />}
                                            </div>
                                            <div className="col-12">
                                                <label className="form-label fw-semibold">Description</label>
                                                <textarea className="form-control custom-input" rows="3" name="description"></textarea>
                                            </div>
                                            <div className="col-12 pt-3">
                                                <button type="submit" className="btn btn-primary btn-lg w-100 py-3 fw-bold rounded-pill">Post My Listing</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Admindeshboard;