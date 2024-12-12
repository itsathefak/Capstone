import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import { fetchServicesWithUserImage } from "../../api/users";
import debounce from "lodash.debounce";
import { Helmet } from "react-helmet";

const MyServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("price");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      if (user && user.id && user.role === "Service Provider") {
        setLoading(true);
        setError(null);
        try {
          const fetchedServices = await fetchServicesWithUserImage(user.id);
          setServices(fetchedServices);

          const uniqueCategories = [
            "all",
            ...new Set(
              fetchedServices
                .map((service) => service.category)
                .filter(
                  (category) =>
                    category && category.toLowerCase() !== "uncategorized"
                )
            ),
          ];
          setCategories(uniqueCategories);
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

  // Debounced function to handle search input changes
  const debouncedSearch = useCallback(
    debounce((query) => {
      navigate(`?query=${encodeURIComponent(query)}`); // Use navigate to update the query string in the URL
      setSearchQuery(query); // Set the search query state
    }, 1000), // Delay of 1000ms after the user stops typing
    []
  );

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value); // Update the input value immediately
    debouncedSearch(value); // Trigger the debounced search function
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearchQuery = service.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearchQuery && matchesCategory;
  });

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

  // Handle edit service
  const handleEditService = (serviceId) => {
    navigate(`/edit-service/${serviceId}`);
  };

  return (
    <div className="my-services">
      <Helmet>
        <title>My Services | AppointMe</title>
        <meta
          name="description"
          content="View and manage the list of created services along with the service details."
        />
        <meta name="keywords" content="created services, my services" />
      </Helmet>

      <div className="services-list">
        <div className="services-header">
          <h2 className="services-heading">My Services</h2>

          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search services..."
              value={searchQuery}
              onChange={handleSearchChange} // Use the updated handleSearchChange
            />
          </div>

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

          <div className="category-dropdown-wrapper">
            <label htmlFor="category-options" className="category-label">
              Category:
            </label>
            <select
              id="category-options"
              className="sort-dropdown"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <p>Loading services...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredServices.length > 0 ? (
        <div className="services-list">
          {sortServices(filteredServices).map((service) => (
            <div key={service._id} className="service-card">
              <img
                src={
                  service.provider?.userImage ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop"
                }
                alt="Service Provider"
                className="profile-avatar"
              />
              <div className="service-details">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">
                  <b>Description : </b>
                  {service.description}
                </p>
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
