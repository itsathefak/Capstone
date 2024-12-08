import React, { useState, useEffect } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useLocation, useNavigate } from "react-router-dom";
import { bookService } from "../api/appointments";
import { createService } from "../api/services";

const PaymentPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    clientSecret,
    paymentDetails,
    userDetails,
    serviceDetails,
    paymentType, // "booking" or "creation"
    paymentIntentId: initialPaymentIntentId,
  } = location.state || {};

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [finalPaymentIntentId, setFinalPaymentIntentId] = useState(
    initialPaymentIntentId || null
  );

  // Extract Payment Intent ID from Client Secret
  useEffect(() => {
    if (!finalPaymentIntentId && clientSecret) {
      const extractedId = clientSecret.split("_secret_")[0];
      console.log("Extracted paymentIntentId:", extractedId);
      setFinalPaymentIntentId(extractedId);
    }
  }, [clientSecret, finalPaymentIntentId]);

  if (!clientSecret) {
    return (
      <p>
        Missing payment intent client secret. Please return to the appropriate
        page.
      </p>
    );
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
        console.log("Payment succeeded:", paymentIntent);

        const intentId =
          finalPaymentIntentId || paymentIntent.id || "UnknownPaymentIntentId";

        if (!intentId) {
          console.error("No valid paymentIntentId available.");
          setMessage("Payment succeeded, but could not retrieve intent ID.");
          return;
        }

        if (paymentType === "booking") {
          await handleBooking(intentId);
        } else if (paymentType === "creation") {
          await handleCreation(intentId);
        } else {
          setMessage("Payment succeeded, but no valid action specified.");
          console.error("Invalid payment type:", paymentType);
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

  const handleBooking = async (paymentIntentId) => {
    const bookingData = {
      ...userDetails,
      ...serviceDetails,
      paymentIntentId,
    };

    try {
      console.log("Sending booking data:", bookingData);
      const response = await bookService(bookingData);
      if (response?.appointment) {
        setMessage("Payment succeeded, and booking was successful!");
        console.log("Booking response:", response);
        navigate("/appointment-history");
      } else {
        setMessage(
          "Payment succeeded, but booking could not be completed. Please contact support."
        );
        console.error("Booking response invalid:", response);
      }
    } catch (err) {
      console.error("Booking API error:", err);
      setMessage(
        "Payment succeeded, but booking could not be completed. Please contact support."
      );
    }
  };

  const handleCreation = async (paymentIntentId) => {
    const providerId = userDetails?.providerId || "UnknownProvider";

    // Prepare creation data
    const creationData = {
      ...serviceDetails,
      provider: String(userDetails?.providerId || ""),
      providerFirstName: userDetails?.firstName,
      providerLastName: userDetails?.lastName,
      paymentIntentId,
    };

    try {
      console.log("Sending creation data:", creationData);

      // Pass `paymentIntentId` and `providerId` explicitly
      const response = await createService(
        creationData,
        paymentIntentId,
        providerId
      );

      if (response?.service) {
        setMessage("Payment succeeded, and service was created!");
        console.log("Service creation response:", response);
        navigate("/service-list");
      } else {
        setMessage(
          "Payment succeeded, but service creation failed. Please contact support."
        );
        console.error("Service creation response invalid:", response);
      }
    } catch (err) {
      console.error("Service creation API error:", err);
      setMessage(
        "Payment succeeded, but service creation failed. Please contact support."
      );
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
