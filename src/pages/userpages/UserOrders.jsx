import React, { useEffect, useState } from 'react';
import api from '../../api';
import Usernavbar from './Usernavbar';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/user/orders", {
          withCredentials: true
        });

        if (res.data.success) {
        
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Delivered': return 'bg-success  border border-success';
      case 'Shipped': return 'bg-primary  border border-primary';
      case 'Processing': return 'bg-warning  border border-warning';
      case 'Cancelled': return 'bg-danger  border border-danger';
      default: return 'bg-secondary border border-secondary';
    }
  };

  if (loading) {
    return (
      <>
        <Usernavbar />
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
          <div className="text-center">
            <div className="spinner-border text-primary mb-2" role="status"></div>
            <p className="text-muted fw-medium">Loading your orders...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Usernavbar />
      <div className="bg-light min-vh-100 py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">

              {/* Header Section */}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                  <h2 className="fw-bold mb-1 text-dark">My Orders</h2>
                  <p className="text-muted mb-0">You have placed {orders.length} orders</p>
                </div>
                <button
                  onClick={() => window.location.reload()}
                  className="btn btn-white btn-sm shadow-sm border rounded-pill px-3"
                >
                  <i className="bi bi-arrow-clockwise me-1"></i> Refresh
                </button>
              </div>

              {/* Orders List */}
              <div className="d-flex flex-column gap-4">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <div key={order._id} className="card border-0 shadow-sm overflow-hidden" style={{ borderRadius: "15px" }}>

                      {/* Order Header */}
                      <div className="card-header bg-white border-bottom py-3 px-4">
                        <div className="row align-items-center">
                          <div className="col-md-3 col-6 mb-2 mb-md-0">
                            <p className="text-muted small text-uppercase mb-0 fw-bold">Order ID</p>
                            <span className="fw-medium text-primary">#{order._id.slice(-8).toUpperCase()}</span>
                          </div>
                          <div className="col-md-3 col-6 mb-2 mb-md-0 text-md-center">
                            <p className="text-muted small text-uppercase mb-0 fw-bold">Date Placed</p>
                            <span className="fw-medium text-dark">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          <div className="col-md-3 col-6 text-md-center">
                            <p className="text-muted small text-uppercase mb-0 fw-bold">Amount (COD)</p>
                            <span className="fw-bold text-dark">₹{order.totalPrice}</span>
                          </div>
                          <div className="col-md-3 col-6 text-md-end">
                            <span className={`badge rounded-pill px-3 py-2 ${getStatusClass(order.status)}`}>
                              ● {order.status || 'processing'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Body */}
                      <div className="card-body p-4">
                        {order.orderItems && order.orderItems.map((item, idx) => (
                          <div key={idx} className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-3 last-child-border-0">
                            <div className="d-flex align-items-center">
                              <div className="bg-white rounded-3 p-1 me-3 border shadow-sm" style={{ width: "70px", height: "70px" }}>
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-100 h-100 object-fit-contain"
                                  onError={(e) => { e.target.src = "https://via.placeholder.com/70?text=Product" }}
                                />
                              </div>
                              <div>
                                <h6 className="fw-bold mb-1 text-dark">{item.name}</h6>
                                <p className="mb-0 text-muted small">
                                  Quantity: <span className="text-dark fw-medium">{item.quantity}</span> |
                                  Price: <span className="text-dark fw-medium">₹{item.price}</span>
                                </p>
                              </div>
                            </div>
                            <div className="text-end d-none d-md-block">
                              <span className="fw-bold text-dark">₹{item.price * item.quantity}</span>
                            </div>
                          </div>
                        ))}

                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 pt-2">
                          <div className="mb-3 mb-md-0 text-muted small">
                            <i className="bi bi-info-circle me-1 text-primary"></i>
                            {order.status === 'Processing' && "We are currently preparing your items for shipping."}
                            {order.status === 'Shipped' && "Your items are on the way!"}
                            {order.status === 'Delivered' && "This order has been successfully delivered."}
                            {order.status === 'Cancelled' && "This order was cancelled."}
                          </div>
                          <div className="d-flex gap-2 w-40 w-md-auto" style={{ height: "43px" }}>
                            <button className="btn btn-outline-secondary btn-sm flex-fill px-4 rounded-pill fw-medium">
                              <i className="bi bi-file-earmark-arrow-down me-1"></i> Invoice
                            </button>
                            <button className="btn btn-primary btn-sm  flex-fill px-3 rounded-pill fw-medium shadow-sm">
                              <i className="bi bi-geo-alt me-1"></i> Track Order
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Address Footer */}
                      <div className="card-footer bg-white border-top-0 py-3 px-4">
                        <div className="p-2 bg-light rounded-3 border-start border-primary border-4">
                          <p className="mb-0 small text-muted">
                            <i className="bi bi-house-door"></i>
                            Delivering To: <span className="text-dark fw-medium">{order.shippingAddress?.address} <br />
                            </span>
                            <p>Contact Delar  : <b>7724977106</b></p>


                          </p>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  /* Empty State UI */
                  <div className="text-center py-5 bg-white rounded-4 shadow-sm border">
                    <div className="mb-4">
                      <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                        <i className="bi bi-cart-x display-4 text-muted"></i>
                      </div>
                      <h3 className="fw-bold">No orders found!</h3>
                      <p className="text-muted mx-auto" style={{ maxWidth: "300px" }}>
                        It looks like you haven't placed any orders yet. Start exploring our fresh farm products.
                      </p>
                    </div>
                    <button
                      onClick={() => window.location.href = '/user/product'}
                      className="btn btn-primary rounded-pill px-5 py-2 fw-bold shadow-sm"
                    >
                      Browse Products
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .last-child-border-0:last-child {
            border-bottom: 0 !important;
            margin-bottom: 0 !important;
            padding-bottom: 0 !important;
        }
      `}</style>
    </>
  );
};

export default UserOrders;