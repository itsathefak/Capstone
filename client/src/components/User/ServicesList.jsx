import React, { useEffect, useState } from "react";
import { fetchServicesWithUserImage } from "../../api/users";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce"; 

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("price");
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query") || "";
    setSearchQuery(query);
  }, [location.search]);

  // Fetch all services initially or based on the search query
  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServicesWithUserImage();
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services. Please try again later.");
      }
    };

    loadServices();
  }, []);

  // Filter services based on search query
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort services
  const sortServices = (services) => {
    return [...services].sort((a, b) => {
      switch (sortOption) {
        case "price":
          return a.price - b.price;
        case "name":
          return a.name.localeCompare(b.name);
        case "date":
          return new Date(b.date) - new Date(a.date);
        default:
          return 0;
      }
    });
  };

  // Handle input change with debounce to minimize URL updates
  const handleSearchChange = debounce((value) => {
    navigate(`?query=${encodeURIComponent(value)}`);
  }, 300);

  // Handle sort change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div>
      <div className="full-width-banner"></div>

      <div className="services-list">
        <div className="services-header">
          <h2 className="services-heading">Services</h2>

          {/* Search Bar */}
          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearchChange(e.target.value); // Update URL and search
              }}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="sort-dropdown-wrapper">
            <label htmlFor="sort-options" className="sort-label">
              Sort by:
            </label>
            <select
              id="sort-options"
              className="sort-dropdown"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="price">Price</option>
              <option value="name">A-Z</option>
              <option value="date">Date</option>
            </select>
          </div>
        </div>

        {/* Render Services */}
        {error && <p className="error-message">{error}</p>}
        {filteredServices.length > 0 ? (
          sortServices(filteredServices).map((service) => (
            <div key={service._id} className="service-card">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
                alt="Service Provider"
                className="profile-avatar"
              />
              <div className="service-details">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-provider-name">
                  {service.provider
                    ? `${service.provider.firstName} ${service.provider.lastName}`
                    : "Provider Info Unavailable"}
                </p>
                <p className="service-description">{service.description}</p>
                <p className="service-price">From CA ${service.price}</p>
                <div className="more-details-wrapper">
                  <Link
                    to={`/services/${service._id}`}
                    className="more-details-button"
                  >
                    More Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No services found matching "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
};

export default ServicesList;
