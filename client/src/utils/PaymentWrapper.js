import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import PaymentPage from "../pages/PaymentPage";

// Replace with your Stripe publishable key
const stripePromise = loadStripe(
  "pk_test_51QRqNEDFrZHl1khh66rvAw2dg74yiAuEHiXv5f3BeJPMlIcgi1yvmb811Zhg4TIWwUdsc0shSCXVPlCAIt9PlrPm00I5WzBQQh"
);

const PaymentWrapper = () => {
  const location = useLocation();
  const { clientSecret } = location.state || {};

  if (!clientSecret) {
    return <p>Error: Missing clientSecret. Please go back and try again.</p>;
  }

  const options = {
    clientSecret,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentPage />
    </Elements>
  );
};

export default PaymentWrapper;
