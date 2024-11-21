import React, { useEffect } from "react";

const Toast = ({ message, duration, onClose }) => {
  useEffect(() => {
    // Convert message to speech
    const speakMessage = () => {
      const speech = new SpeechSynthesisUtterance(message);
      speech.lang = "en-US";
      speech.volume = 1;
      speech.rate = 1;
      speech.pitch = 1;
      
      // Speak the message
      window.speechSynthesis.speak(speech);
    };

    speakMessage();

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