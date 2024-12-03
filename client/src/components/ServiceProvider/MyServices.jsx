import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { fetchServicesByProvider } from "../../api/services";
import debounce from "lodash.debounce"; // Add lodash.debounce

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("price");
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch services on component mount
  useEffect(() => {
    const fetchServices = async () => {
      if (user && user.id && user.role === "Service Provider") {
        setLoading(true);
        setError(null);
        try {
          const fetchedServices = await fetchServicesByProvider(user.id);
          setServices(fetchedServices);
        } catch (err) {
          console.error("Failed to fetch services:", err);
          setError("Failed to fetch services");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchServices();
  }, [user]);

  // Handle edit service
  const handleEditService = (serviceId) => {
    navigate(`/edit-service/${serviceId}`);
  };

  // Filter services based on search query
  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort services based on the selected option
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

  // Handle input change with debounce for search
  const handleSearchChange = debounce((value) => {
    setSearchQuery(value);
  }, 300);

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="my-services">
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
</div>
      {/* Service Listing */}
      {loading ? (
        <p>Loading services...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredServices.length > 0 ? (
        <div className="services-list">
          {sortServices(filteredServices).map((service) => (
            <div key={service._id} className="service-card">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
                alt="Service Provider"
                className="profile-avatar"
              />
              <div className="service-details">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <p className="service-price">From CA ${service.price}</p>
                <div className="more-details-wrapper">
                  <button
                    onClick={() => handleEditService(service._id)}
                    className="more-details-button"
                  >
                    Edit Service
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No services found</p>
      )}
    </div>
  );
};

export default MyServices;
