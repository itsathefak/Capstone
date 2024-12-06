import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import { bookService } from "../api/appointments";

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();

  const { clientSecret, paymentDetails, userDetails, serviceDetails } =
    location.state || {};

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!clientSecret) {
    return <p>Missing payment intent. Please return to the booking page.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      alert("Stripe is not properly loaded. Please try again.");
      return;
    }

    setIsLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: "http://localhost:3000/complete",
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment error:", error.message);
        setMessage(error.message);
        setIsLoading(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        const bookingData = {
          ...userDetails,
          ...serviceDetails,
          paymentIntentId: paymentIntent.id,
        };

        console.log("Sending booking data to backend:", bookingData);

        try {
          const response = await bookService(bookingData);
          console.log("Booking API response:", response);

          if (response?.appointment) {
            setMessage("Payment succeeded, and booking was successful!");
          } else {
            setMessage(
              "Payment succeeded, but booking could not be completed."
            );
          }
        } catch (err) {
          console.error(
            "Booking API error:",
            err.response?.data || err.message
          );
          setMessage(
            "Payment succeeded, but booking could not be completed. Please contact support."
          );
        }
      } else {
        console.warn("Payment was not successful:", paymentIntent?.status);
        setMessage(
          "Payment was not successful. Please check your payment details."
        );
      }
    } catch (err) {
      console.error("Payment confirmation error:", err.message);
      setMessage("Payment confirmation failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2 className="payment-header">Complete Your Payment</h2>

      {paymentDetails && (
        <div className="payment-summary">
          <h2>Payment Summary</h2>
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>${paymentDetails.subtotal?.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Tax (13%):</span>
            <span>${paymentDetails.tax?.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Platform Fee:</span>
            <span>${paymentDetails.platformFee?.toFixed(2)}</span>
          </div>
          <div className="summary-row summary-total">
            <span>Total:</span>
            <span>${paymentDetails.total?.toFixed(2)}</span>
          </div>
        </div>
      )}

      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="payment-element">
          <PaymentElement />
        </div>
        <button
          type="submit"
          className="payment-button"
          disabled={isLoading || !stripe || !elements}
        >
          {isLoading ? <div className="spinner" /> : "Pay Now"}
        </button>
        {message && <div className="payment-message">{message}</div>}
      </form>
    </div>
  );
};

export default PaymentPage;
