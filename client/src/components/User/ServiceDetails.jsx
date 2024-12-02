import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";


const ServiceDetails = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

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
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
            alt="Provider"
          />
          <div className="user-provider-info">
            <p className="user-provider-name">
              {service.providerFirstName} {service.providerLastName}
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
            Tax (calculated in checkout) <span>$26.00</span>
          </p>
          <p>
            Platform Charges ($40) <span>$40.00</span>
          </p>
          <hr />
          <p className="user-total">
            Estimated Total <span>${(service.price + 26 + 40).toFixed(2)}</span>
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
