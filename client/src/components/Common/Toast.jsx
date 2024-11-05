import React, { useEffect } from "react";

const Toast = ({ message, duration, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="com-toast-container">
      <p>{message}</p>
    </div>
  );
};

export default Toast;