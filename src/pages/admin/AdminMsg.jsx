import React, { useEffect, useState } from "react";
import api from '../../api';
import Navbar from "./Navbar";

const AdminMsg = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await api.get(
        "/api/admin/message",
        { withCredentials: true }
      );

      setMessages(res.data.messages);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 DELETE HANDLER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(
        `/api/admin/message/${id}`,
        { withCredentials: true }
      );

      // UI se message hatao
      setMessages(messages.filter((msg) => msg._id !== id));

    } catch (error) {
      alert("Failed to delete message");
    }
  };

  if (loading) {
    return <h4 className="text-center mt-5">Loading messages...</h4>;
  }

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <h3 className="mb-4 text-center">User Messages</h3>

        {messages.length === 0 ? (
          <p className="text-center">No messages found</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Action</th> {/* 👈 NEW */}
                </tr>
              </thead>
              <tbody>
                {messages.map((msg) => (
                  <tr key={msg._id}>
                    <td>{msg.name}</td>
                    <td>{msg.mobile}</td>
                    <td>{msg.email}</td>
                    <td>{msg.message}</td>
                    <td>{new Date(msg.createdAt).toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(msg._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminMsg;
