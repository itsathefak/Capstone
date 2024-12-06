import api from "./api";

// Create a payment intent
export const createPaymentIntent = async (amount) => {
  try {
    const response = await api.post("/appointments/payments/create-intent", {
      amount,
    });
    return response.data; // Assume it returns { clientSecret }
  } catch (error) {
    console.error("Error creating payment intent:", error);
    throw error;
  }
};

// Validate payment intent (optional, can be validated on the backend too)
export const validatePaymentIntent = async (paymentIntentId) => {
  try {
    const response = await api.get(
      `/api/payments/validate-intent/${paymentIntentId}`
    );
    return response.data; // Assume it validates and returns payment status
  } catch (error) {
    console.error("Error validating payment intent:", error);
    throw error;
  }
};
