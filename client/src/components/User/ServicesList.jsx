import React, { useEffect, useState, useCallback } from "react";
import { fetchServicesWithUserImage } from "../../api/users";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import debounce from "lodash.debounce";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState(""); // Controlled input value
  const [searchQuery, setSearchQuery] = useState(""); // Actual query for filtering
  const [sortOption, setSortOption] = useState("price");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const location = useLocation();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    userImage: "",
  });

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/user/userProfile",
        {
          withCredentials: true,
        }
      );
      setUserData(response.data); // Update userData state
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data);
    }
  };

  useEffect(() => {
    fetchUserData(); // This will run as soon as the component is mounted
  }, []);

  // Extract query parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("query") || "";
    setSearchQuery(query);
    setSearchInput(query); // Sync input with query
  }, [location.search]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await fetchServicesWithUserImage();
        setServices(data);

        // Extract unique categories from services and filter out uncategorized
        const uniqueCategories = [
          "all",
          ...new Set(
            data
              .map((service) => service.category)
              .filter(
                (category) =>
                  category && category.toLowerCase() !== "uncategorized"
              )
          ),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching services:", error);
        setError("Failed to load services. Please try again later.");
      }
    };

    loadServices();
  }, []);

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
    setSearchInput(value); // Update the input value immediately
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

  return (
    <div>
      <Helmet>
        <title>Services | AppointMe</title>
        <meta
          name="description"
          content="View all the services created by our providers and book an appointment."
        />
        <meta
          name="keywords"
          content="services, service list, book appointment"
        />
      </Helmet>
      <div className="full-width-banner"></div>

      <div className="services-list">
        <div className="services-header">
          <h2 className="services-heading">Services</h2>

          <div className="search-wrapper">
            <input
              type="text"
              className="search-input"
              placeholder="Search services..."
              value={searchInput} // Controlled input value
              onChange={handleSearchChange} // Trigger search with debounce
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

          {/* Category Dropdown */}
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

        {/* Render Services */}
        {error && <p className="error-message">{error}</p>}
        {filteredServices.length > 0 ? (
          sortServices(filteredServices).map((service) => (
            <div key={service._id} className="service-card">
              <img
                src={
                  service.provider.userImage
                    ? service.provider.userImage
                    : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                }
                alt="Service Provider"
                className="profile-avatar"
              />
              <div className="service-details">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-provider-name">
                  <b>Name : </b>
                  {service.provider
                    ? `${service.provider.firstName} ${service.provider.lastName}`
                    : "Provider Info Unavailable"}
                </p>
                <p className="service-description">
                  <b>Description : </b>
                  {service.description}
                </p>
                <p className="service-category">
                  <b>Category :</b> {service.category}
                </p>
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
