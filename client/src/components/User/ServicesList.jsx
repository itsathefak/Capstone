import React, { useEffect, useState } from "react";
import { fetchServicesWithUserImage } from "../../api/users";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { Helmet } from "react-helmet";
import axios from "axios";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
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
      console.log(response.data, "Headers");
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

  const handleSearchChange = debounce((value) => {
    navigate(`?query=${encodeURIComponent(value)}`);
  }, 300);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div>
      <Helmet>
        <title>Services | AppointMe</title>
        <meta
          name="description"
          content="View all the service create by our providers and book an appointment."
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
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearchChange(e.target.value);
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
                src={service.provider.userImage}
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
