import React from "react";
import { useAuth } from "../utils/AuthContext";

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.firstName}!</h1>

      <p>Here is your personalized dashboard.</p>
    </div>
  );
};

export default Dashboard;
