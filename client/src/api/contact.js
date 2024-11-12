import api from "./api";

// Function to submit contact form data
export const submitContactForm = async (contactData) => {
  try {
    const response = await api.post("/contact", contactData);
    return response.data;
  } catch (error) {
    console.error("Error submitting contact form:", error);
    throw error;
  }
};

// Function to fetch all contact submissions for the admin
export const fetchContacts = async () => {
  try {
    const response = await api.get("/contact/admin/contacts");
    return response.data.contacts; // Return just the contacts array
  } catch (error) {
    console.error("Error fetching contacts:", error);
    throw new Error("Unable to fetch contacts. Please try again later.");
  }
};
