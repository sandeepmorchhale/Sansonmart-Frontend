import React, { useEffect, useState } from "react";
import api from '../../api';
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Adminlistings = () => {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/admin/products");
      setProducts(res.data.products || []);
    } catch (error) {
      console.log("API Error:", error);
    }
  };

  const removeitem = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.delete(`/api/admin/products/delete/${id}`);
      setProducts(products.filter((item) => item._id !== id));
    } catch (error) {
      alert("Failed to delete");
    }
  };

  return (
    <>
      <Navbar />
      <div className="admin-listings-page bg-light min-vh-100 py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-5">
            <h2 className="fw-bold">📦 Product Listings</h2>
            <button onClick={() => nav("/admin/deshboard")} className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">+ Add New</button>
          </div>

          <div className="row g-4">
            {products.map((item) => {
     
              return (
                <div className="col-12 col-sm-6 col-lg-3" key={item._id}>
                  <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                    <div className="position-relative" style={{ height: "200px" }}>
                      <img 
                        src={item.img} 
                        alt={item.name}
                        className="w-100 h-100 object-fit-cover"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/300x200?text=Error+Loading+Image"; }}
                      />
                      <span className="badge bg-white text-primary position-absolute top-0 end-0 m-3 shadow-sm rounded-pill px-3 py-2 fw-bold">{item.veriety}</span>
                    </div>
                    <div className="card-body p-3">
                      <h5 className="fw-bold text-dark text-truncate">{item.name}</h5>
                      
                      <div className="d-flex justify-content-between mt-3">
                        <span className="text-muted small">Price</span>
                        <span className="fw-bold text-primary">₹{item.price}/kg</span>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <span className="text-muted small">Village</span>
                        <span className="text-dark small">{item.village}</span>
                      </div>
                    </div>
                    <div className="card-footer bg-white border-0 p-3 pt-0">
                      <div className="row g-2">
                        <div className="col-6">
                          <button onClick={() => nav("/admin/editproducts", { state: item })} className="btn btn-outline-success w-100 btn-sm rounded-3">Edit</button>
                        </div>
                        <div className="col-6">
                          <button onClick={() => removeitem(item._id)} className="btn btn-outline-danger w-100 btn-sm rounded-3">Delete</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Adminlistings;