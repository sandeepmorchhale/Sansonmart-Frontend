import React, { useEffect, useState } from 'react';
import api from '../../api';
import Navbar from './Navbar';
import toast, { Toaster } from 'react-hot-toast';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = () => {
    setLoading(true);
    api.get("/api/admin/orders", { withCredentials: true })
      .then(res => {
        setOrders(res.data.orders);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        toast.error("Could not load orders");
      });
  };

  useEffect(() => { fetchOrders(); }, []);

  // 1. Status Update Function
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/api/admin/order/status/${orderId}`,
        { status: newStatus },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(`Status updated to ${newStatus}`);
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  // 2. Delete Function (With Backend status:true fix)
  const handleDelete = async (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        const res = await api.delete(`/api/admin/order/delete/${orderId}`, { 
          withCredentials: true 
        });

        if (res.data.status === true) { 
          toast.success(res.data.message);
          setOrders(prevOrders => prevOrders.filter(order => order._id !== orderId));
        }
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };
  // 3. Search Filter
  const filteredOrders = orders.filter(order =>
    order.shippingAddress[0]?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id.includes(searchTerm)
  );

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
      <div className="spinner-border text-primary" role="status"></div>
    </div>
  );

  return (
    <div className="bg-light min-vh-100">
      <Toaster />
      <Navbar />

      <div className="container-fluid px-4 py-5">
        <div className="row align-items-center mb-4">
          <div className="col-md-4">
            <h2 className="fw-bold text-dark mb-1">Orders Dashboard</h2>
            <p className="text-secondary small">Track and manage all customer purchases</p>
          </div>

          <div className="col-md-5">
            <div className="input-group shadow-sm border rounded-3 bg-white">
              <span className="input-group-text bg-white border-0"><i className="bi bi-search"></i></span>
              <input
                type="text"
                className="form-control border-0 ps-0 shadow-none"
                placeholder="Search by Name or Order ID..."
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-3 text-end">
            <div className="bg-dark text-white rounded-pill px-4 py-2 d-inline-block shadow-sm fw-bold">
              Total Orders: {filteredOrders.length}
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="bg-white border-bottom">
                <tr className="text-nowrap">
                  <th className="ps-4 py-3 text-muted small text-uppercase fw-bold">Order ID</th>
                  <th className="py-3 text-muted small text-uppercase fw-bold">Customer</th>
                  <th className="py-3 text-muted small text-uppercase fw-bold">Email</th>
                  <th className="py-3 text-muted small text-uppercase fw-bold">Contact</th>
                  <th className="py-3 text-muted small text-uppercase fw-bold" style={{ width: '220px' }}>Address</th>
                  <th className="py-3 text-muted small text-uppercase fw-bold">Items Details</th>
                  <th className="py-3 text-muted small text-uppercase fw-bold">Amount</th>
                  <th className="py-3 text-muted small text-uppercase fw-bold">Status</th>
                  <th className="py-3 text-muted small text-uppercase fw-bold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="ps-4">
                        <code className="text-primary fw-bold">#{order._id.slice(-6).toUpperCase()}</code>
                      </td>
                      <td className="fw-bold text-dark">{order.shippingAddress[0]?.username}</td>
                      <td className="small text-muted">{order.shippingAddress[0]?.email}</td>
                      <td className="small text-muted">{order.shippingAddress[0]?.mobile}</td>
                      <td>
                        <div className="small text-muted" style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                          {order.shippingAddress[0]?.address}
                        </div>
                      </td>
                      
                      <td>
                        <div className="d-flex flex-column gap-1" style={{ maxHeight: '120px', overflowY: 'auto', minWidth: '160px' }}>
                          {order.orderItems.map((item, i) => (
                            <div key={i} className="p-2 rounded bg-light border-bottom border-white shadow-sm" style={{ fontSize: '0.8rem' }}>
                              <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '140px' }}>{item.name}</div>
                              <div className="text-primary fw-bold small">Qty: {item.quantity} | ₹{item.price}</div>
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="fw-bold text-dark">₹{order.totalPrice.toLocaleString()}</td>
                      <td>
                        <span className={`badge rounded-pill px-3 py-2 w-100 ${
                          order.status === 'Delivered' ? 'bg-success' :
                          order.status === 'Shipped' ? 'bg-primary' :
                          order.status === 'Cancelled' ? 'bg-danger' : 'bg-warning text-dark'
                        }`}>
                          {order.status || 'Processing'}
                        </span>
                      </td>
                      <td className="pe-4">
                        <div className="d-flex align-items-center gap-2 justify-content-center">
                          <select
                            className="form-select form-select-sm shadow-none border bg-light"
                            style={{ width: '125px', borderRadius: '6px' }}
                            value={order.status || 'Processing'}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <button
                            onClick={() => handleDelete(order._id)}
                            className="btn btn-sm btn-outline-danger border-0 rounded-circle"
                            title="Delete Order"
                          >
                            <i className="bi bi-trash3-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="text-center py-5 text-muted">No orders match your search results.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;