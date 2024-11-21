import React from "react";
import { CardElement } from "@stripe/react-stripe-js";

const PaymentPage = () => {
  return (
    <div className="payment-container">
      <form className="payment-form">
        <h2 className="payment-title">Complete Your Payment</h2>

        <div className="payment-field">
          <label htmlFor="card-element" className="payment-label">
            Card Details
          </label>
          <div className="card-element-wrapper">
            <CardElement
              id="card-element"
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": { color: "#aab7c4" },
                  },
                  invalid: { color: "#9e2146" },
                },
              }}
            />
          </div>
        </div>

        <button type="button" className="payment-button">
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
