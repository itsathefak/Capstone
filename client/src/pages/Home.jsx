import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Footer from "../components/Common/Footer";
import backgroundVideo from "../assets/background.mp4";


const Home = () => {
  const features = [
    {
      title: "Smart Scheduling",
      description:
        "AI-powered algorithm optimizes your calendar for maximum efficiency.",
    },
    {
      title: "Real-time Sync",
      description: "Instant updates across all devices, never miss a beat.",
    },
    {
      title: "Seamless Collaboration",
      description: "Effortlessly coordinate with team members and clients.",
    },
    {
      title: "Personalized Experience",
      description:
        "Tailored suggestions based on your preferences and history.",
    },
    {
      title: "Bank-level Security",
      description: "Your data is protected with state-of-the-art encryption.",
    },
    {
      title: "Lightning Fast",
      description:
        "Blazing quick performance, even with thousands of appointments.",
    },
  ];

  const userTypes = [
    {
      title: "Service Providers",
      items: [
        "Create dynamic service listings with rich media",
        "Set complex availability patterns with ease",
        "Access detailed analytics and insights",
        "Automate appointment reminders and follow-ups",
      ],
    },
    {
      title: "Clients",
      items: [
        "Discover and book services with a few taps",
        "View real-time availability across providers",
        "Manage all your appointments in one place",
        "Enjoy a seamless, personalized booking experience",
      ],
    },
  ];

  const stats = [
    { number: "10k+", label: "Active Users" },
    { number: "1M+", label: "Appointments Booked" },
    { number: "4.9", label: "Average Rating" },
    { number: "99.9%", label: "Uptime" },
  ];

  const testimonials = [
    {
      name: "John Doe",
      role: "Entrepreneur",
      feedback:
        "AppointMe has streamlined my business operations and saved me countless hours. A must-have for any professional!",
    },
    {
      name: "Jane Smith",
      role: "Freelancer",
      feedback:
        "The seamless integration and real-time sync have changed the way I manage my schedule. Absolutely love it!",
    },
    {
      name: "Mark Taylor",
      role: "Manager",
      feedback:
        "The level of customization and security offered by AppointMe is unparalleled. Highly recommend it!",
    },
  ];

  return (
    <div className="Home-bg">
      <Helmet>
        <title>Home | AppointMe</title>
        <meta name="description" content="AppointMe is an easy-to-use appointment booking website that connects people with professional service providers." />
        <meta name="keywords" content="appointme, book appointment, book service" />
      </Helmet>

      <section className="Home-hero">
        <video className="Home-hero-video" autoPlay loop muted>
          <source src={backgroundVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="Home-hero-content">
          <h1 className="Home-title">AppointMe</h1>
          <p className="Home-subtitle">
            Revolutionize Your Scheduling Experience
          </p>
          <Link to="/service-list">
            <button className="Home-button Home-button-primary">
              Start Your Journey
            </button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="Home-features-section">
        <h2 className="Home-features-title">Unleash the Power of AppointMe</h2>
        <div className="Home-features-grid">
          {features.map((feature, index) => (
            <div key={index} className="Home-feature">
              <h3 className="Home-feature-title">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Lists Section */}
      <section className="Home-lists-section">
        <h2 className="Home-features-title">Explore Our User Features</h2>
        <div className="Home-lists-grid">
          {userTypes.map((userType, index) => (
            <div key={index} className="Home-list">
              <h3 className="Home-list-title">{userType.title}</h3>
              <ul>
                {userType.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="Home-list-item">
                    <svg
                      className="Home-list-item-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="Home-stats-section">
        <h2 className="Home-features-title">Our Achievements</h2>
        <div className="Home-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="Home-stat">
              <div className="Home-stat-number">{stat.number}</div>
              <p className="Home-stat-label">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="Home-testimonials-section">
        <h2 className="Home-testimonials-title">What Our Users Say</h2>
        <div className="Home-testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="Home-testimonial">
              <p className="Home-testimonial-feedback">
                "{testimonial.feedback}"
              </p>
              <h3 className="Home-testimonial-name">- {testimonial.name}</h3>
              <p className="Home-testimonial-role">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="Home-cta-section">
        <div className="Home-cta-content">
          <h2 className="Home-cta-title">
            Ready to Transform Your Scheduling?
          </h2>
          <p className="Home-cta-text">
            Join thousands of satisfied users and experience the future of
            appointment booking.
          </p>
          <div className="Home-cta-buttons">
          <Link to="/service-list">
            <button className="Home-button-primary">Get Started Now</button>
            </Link>
            <Link to="/contact-us">
            <button className="Home-cta-button Home-cta-outline-button">
              Schedule a Demo
            </button>
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Home;