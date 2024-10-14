import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const cookieData = Cookies.get("auth")
      ? JSON.parse(Cookies.get("auth"))
      : null;

    if (token || cookieData) {
      setUser(cookieData ? cookieData.user : null);
    }
    setLoading(false);
  }, []);

  // Returns true if user is set
  const isAuthenticated = () => {
    return !!user;
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    Cookies.remove("auth");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default AuthContext;
