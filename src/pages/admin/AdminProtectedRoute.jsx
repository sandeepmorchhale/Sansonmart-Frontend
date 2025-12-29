import { Navigate, Outlet } from "react-router-dom";
import api from '../../api';
import { useEffect, useState } from "react";

const AdminProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        await api.get(
          "/api/admin/adminprotaction",
          { withCredentials: true }
        );
        setIsAdmin(true);
      } catch (error) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) return <h2>Checking admin access...</h2>;

  return isAdmin ? <Outlet/> : <Navigate to="/admin/login" />;
};

export default AdminProtectedRoute;
