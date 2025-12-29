import React, { useState } from "react";
import api from '../../api';
import Usernavbar from "./Usernavbar";

const UserChat = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await api.post(
        "/api/user/chat/send",
        formData,
        { withCredentials: true }
      );
      
      setSuccess("Message sent successfully ✅");
      setFormData({
        name: "",
        mobile: "",
        email: "",
        message: ""
      });
    } catch (err) {
      setError("Failed to send message ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Usernavbar />
      <div className="py-5" style={{ background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)", minHeight: "92vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="card border-0 shadow-lg overflow-hidden" style={{ borderRadius: "15px" }}>
                <div className="row g-0">
                  
                  {/* Left Side: Visual/Info Panel */}
                  <div className="col-md-5 bg-primary p-5 text-white d-flex flex-column justify-content-center">
                    <h2 className="fw-bold mb-4">Get in Touch</h2>
                    <p className="opacity-75 mb-4">
                      Have questions about your order or our products? Send us a message and our team will get back to you within 24 hours.
                    </p>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3">
                        <i className="bi bi-geo-alt"></i>
                      </div>
                      <span> <b> 59 Gram Chhipipura , New Harsud </b></span>
                    </div>
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-white bg-opacity-25 rounded-circle p-2 me-3">
                        <i className="bi bi-envelope"></i>
                      </div>
                      <span><b>WhatsApp : 7724977106</b></span>
                    </div>
                  </div>

                  {/* Right Side: Form */}
                  <div className="col-md-7 bg-white p-5">
                    <h3 className="fw-bold text-dark mb-4">Send a Message</h3>

                    {success && (
                      <div className="alert alert-success border-0 small py-2 text-center" role="alert">
                        {success}
                      </div>
                    )}
                    {error && (
                      <div className="alert alert-danger border-0 small py-2 text-center" role="alert">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label small fw-bold text-muted text-uppercase">Full Name</label>
                          <input
                            type="text"
                            name="name"
                            className="form-control form-control-lg bg-light border-0 fs-6"
                            placeholder="Enter Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label small fw-bold text-muted text-uppercase">Phone Number</label>
                          <input
                            type="number"
                            name="mobile"
                            className="form-control form-control-lg bg-light border-0 fs-6"
                            placeholder="Enter Your Mobile Number"
                            value={formData.mobile}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control form-control-lg bg-light border-0 fs-6"
                          placeholder="Enter Your Email Id"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label className="form-label small fw-bold text-muted text-uppercase">Message</label>
                        <textarea
                          name="message"
                          className="form-control form-control-lg bg-light border-0 fs-6"
                          rows="4"
                          placeholder="How can we help you?"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
                        disabled={loading}
                        style={{ borderRadius: "10px", transition: "all 0.3s" }}
                      >
                        {loading ? (
                          <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : null}
                        {loading ? "Sending..." : "Send Message"}
                      </button>
                    </form>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserChat;