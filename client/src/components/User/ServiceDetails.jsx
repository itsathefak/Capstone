import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

  const [userData, setUserData] = useState({
    userImage: '',
  });

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/userService/services-with-user-image", {
        withCredentials: true,
      });
      setUserData(response.data); // Update userData state
      console.log(response.data, "Services");
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data);
    }
  };

  useEffect(() => {
    fetchUserData(); // This will run as soon as the component is mounted
  }, []);

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `http://localhost:5000/services/${serviceId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setService(response.data);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError("Failed to load service details.");
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  if (error) return <div className="error-message">{error}</div>;
  if (!service) return <div>Loading service details...</div>;

  const taxRate = 0.13; // 13% tax rate
  const tax = service.price * taxRate;
  const platformCharges = 40;
  const estimatedTotal = service.price + tax + platformCharges;

  return (
    <div className="user-service-details">
      <Helmet>
        <title>Service Details | AppointMe</title>
        <meta name="description" content="Find more details about the service like the provider reviews and service charges." />
        <meta name="keywords" content="service details, service charges" />
      </Helmet>
      <div className="user-service-content">
        <h2 className="user-service-title">{service.name}</h2>
        <div className="user-service-provider">
          <img
            src={
              service.provider.userImage && service.provider.userImage.trim() !== ""
                ? service.provider.userImage
                : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="Service Provider"
            className="profile-avatar"
          />
          <div className="user-provider-info">
            <p className="user-provider-name">
              {service.provider.firstName} {service.provider.lastName}
            </p>
            <p className="user-provider-rating">⭐⭐⭐⭐☆</p>
          </div>
        </div>

        <p className="user-service-description">{service.description}</p>
      </div>

      <div className="user-order-summary">
        <h3>Order Summary</h3>
        <div className="user-summary-details">
          <p>
            Subtotal <span>${service.price.toFixed(2)}</span>
          </p>
          <p>
            Tax (13%) <span>${tax.toFixed(2)}</span>
          </p>
          <p>
            Platform Charges ($40) <span>$40.00</span>
          </p>
          <hr />
          <p className="user-total">
            Estimated Total <span>${estimatedTotal.toFixed(2)}</span>
          </p>
        </div>

        {/* Book Service Button */}
        <Link to={`/book-service/${serviceId}`}>
          <button className="user-book-button">Book Your Service Now!</button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceDetails;
