import { Navigate, Outlet } from "react-router-dom";
import api from '../../../src/api';
import { useEffect, useState } from "react";

const UserProtactedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try { await api.get("/api/user/userprotaction",{ withCredentials: true });
        setIsUser(true);

      } catch (error) {
        setIsUser(false);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (loading) return <h2>Checking User access...</h2>;

  return isUser ? <Outlet/> : <Navigate to="/user/login" />;
};

export default UserProtactedRoute;
