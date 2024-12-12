import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user, token, and role data from localStorage or cookies
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

  // Returns true if user is authenticated
  const isAuthenticated = () => {
    return !!user;
  };

  // Returns true if user has a specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Login function to set the user, token, and role
  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem("token", token);
    Cookies.set("auth", JSON.stringify({ user: userData }), { expires: 7 });
  };

  // Update user profile in the context
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
    const cookieData = Cookies.get("auth")
      ? JSON.parse(Cookies.get("auth"))
      : null;

    if (cookieData) {
      Cookies.set("auth", JSON.stringify({ user: updatedUserData }), {
        expires: 7,
      });
    }
  };

  // Logout function to clear user data
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    Cookies.remove("auth");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUser,
        loading,
        isAuthenticated,
        hasRole,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export default AuthContext;
