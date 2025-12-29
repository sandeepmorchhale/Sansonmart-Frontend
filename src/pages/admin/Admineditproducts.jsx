import React, { useState } from 'react'
import Navbar from './Navbar'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../../api';



const Admineditproducts = () => {

    const { state } = useLocation()
    const nav = useNavigate()
    const [formdata, setformdata] = useState({
        
        name: state.name,
        stock: state.stock,
        village: state.village,
        price: state.price,
        packaging: state.packaging,
        description: state.description,
        veriety: state.veriety
    })

    const changedetails = (e) => {

        setformdata({
            ...formdata,
            [e.target.name]: e.target.value

        })
    }
    const updatedproducts = async () => {

        if (!window.confirm("are you sure you want to dalete this product ?")) return

        try {
            api.put(`/api/admin/products/update/${state._id}`,
                formdata,
                alert("product updated sucessfully"),
                nav("/admin/listings")
            )

        } catch (error) {
            console.log("any problume to update this product", error)
        }
    }
    return (
        <>
        
        <Navbar />
        <div className="udpage village-bg">
            <div className="container py-4">
                <div className="row gx-4">
                    <main className="col-md-12 mt-3">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h2 className="mb-1">Welcome back, edit</h2>
                                <p className="text-muted mb-0">
                                    Manage your butter oil listings and sell to nearby villages
                                </p>
                            </div>
                            <div className="small-stats d-flex gap-3">
                                <div className="stat card p-3 text-center">
                                    <div className="stat-value">24</div>
                                    <div className="stat-label">Orders</div>
                                </div>
                                <div className="stat card p-3 text-center">
                                    <div className="stat-value">12</div>
                                    <div className="stat-label">Active Ads</div>
                                </div>
                            </div>
                        </div>

                        <div className="card listing-card mb-4">
                            <div className="card-body">
                                <h4 className="card-title">Sell Butter Oil</h4>
                                <p className="card-text text-muted">
                                    Fill this form to create a new butter oil listing.
                                </p>

                                {/* FORM START */}
                                <form onSubmit={updatedproducts} className="mt-3">
                                    <div className="row g-3">

                                        <div className="col-md-6">
                                            <label className="form-label">Product Name</label>
                                            <input onChange={changedetails} className="form-control" type="text" name="name" value={formdata.name} />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Variety</label>
                                            <select onChange={changedetails} value={formdata.veriety} name="veriety" className="form-select">
                                                <option>BAFFELOW</option>
                                                <option>COW</option>
                                                <option>MIX</option>
                                                <option>MORCHHALE DAIRY FORM CHHIPIPURA</option>


                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Quantity (kg)</label>
                                            <input onChange={changedetails} className="form-control" type="number" name="stock" value={formdata.stock} placeholder="e.g. 5" />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Price per kg (₹)</label>
                                            <input onChange={changedetails} className="form-control" type="number" name="price" value={formdata.price} placeholder="e.g. 400" />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Contact Number</label>
                                            <input onChange={changedetails} className="form-control" type="tel" name="contact" value={formdata.contact} placeholder="98765-43210" />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Seller Village</label>
                                            <input onChange={changedetails} className="form-control" type="text" name="village" value={formdata.village} placeholder="Village name" />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label">Packaging</label>
                                            <select onChange={changedetails} name="packaging" value={formdata.packaging} className="form-select">
                                                <option>Glass Jar</option>
                                                <option>Plastic Bottle</option>
                                                <option>normal</option>

                                            </select>
                                        </div>

                                        <div className="col-12">
                                            <label className="form-label">Description</label>
                                            <textarea onChange={changedetails} className="form-control" rows="4" name="description" value={formdata.description} placeholder="Short description here..."></textarea>
                                            {/* FIXED NAME */}
                                        </div>

                                        <div className="col-12 d-flex justify-content-end">
                                            <button type="submit" className="btn btn-primary btn-lg">Update Listing</button>
                                        </div>

                                    </div>
                                </form>
                                {/* FORM END */}

                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
        </>
    )
}

export default Admineditproducts