import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchServiceById } from "../../api/services";

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await fetchServiceById(serviceId);
        setService(data);
      } catch (error) {
        console.error("Error fetching service:", error);
        setError("Failed to load service details.");
      }
    };
    fetchService();
  }, [serviceId]);

  if (error) return <p className="error-message">{error}</p>;
  if (!service) return <p>Loading...</p>;

  return (
    <div className="service-details">
      <h1>{service.name}</h1>
      <p>{service.description}</p>
      <h2>
        Service Provider: {service.provider.firstName}{" "}
        {service.provider.lastName}
      </h2>
      <Link to={`/book-service/${serviceId}`} className="book-service-button">
        Book This Service
      </Link>
    </div>
  );
};

export default ServiceDetails;
