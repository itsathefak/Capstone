import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faBell,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export default function AboutPage() {
  const teamMembers = [
    { name: "Aman Sharma", role: "Full Stack Developer", avatar: "AS" },
    { name: "Athef Ayub Khan", role: "UX Designer", avatar: "AAK" },
    { name: "Anitia Feber", role: "Backend Developer", avatar: "AF" },
    { name: "Daksh", role: "Frontend Developer", avatar: "D" },
  ];

  return (
    <div className="about-min-h-screen about-bg-gradient">
      <div className="about-container">
        <section className="about-text-center">
          <h1 className="about-title">About AppointMe</h1>
          <p className="about-description">
            Revolutionizing appointment booking for the digital age. Connect
            with professionals effortlessly.
          </p>
        </section>

        <section className="about-mb-24">
          <h2 className="about-subtitle">Our Vision</h2>
          <div className="about-grid">
            <div className="about-card">
              <h3 className="about-card-title">Seamless Connections</h3>
              <p className="about-card-description">
                AppointMe bridges the gap between service providers and clients,
                creating a frictionless booking experience that saves time and
                reduces stress.
              </p>
            </div>
            <div className="about-card">
              <h3 className="about-card-title">Professional Empowerment</h3>
              <p className="about-card-description">
                We empower professionals with cutting-edge tools to manage their
                schedules, showcase their services, and grow their client base
                effortlessly.
              </p>
            </div>
          </div>
        </section>

        <section className="about-mb-24">
          <h2 className="about-subtitle">Key Features</h2>
          <div className="about-grid about-lg-grid">
            {[
              {
                icon: faCalendar,
                title: "Smart Booking",
                description:
                  "AI-powered scheduling for optimal time management",
              },
              {
                icon: faClock,
                title: "Real-time Availability",
                description:
                  "Up-to-the-minute schedule updates for accurate booking",
              },
              {
                icon: faBell,
                title: "Instant Notifications",
                description: "Stay informed with real-time booking alerts",
              },
              {
                icon: faUsers,
                title: "Multi-user Support",
                description:
                  "Seamless experience for both providers and clients",
              },
            ].map((feature, index) => (
              <div key={index} className="about-card about-card-feature">
                <FontAwesomeIcon icon={feature.icon} className="about-icon" />
                <h3 className="about-feature-title">{feature.title}</h3>
                <p className="about-feature-description">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="about-mb-24">
          <h2 className="about-subtitle">Meet Our Innovators</h2>
          <div className="about-grid about-lg-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="about-card about-card-team">
                <div className="about-avatar">
                  <span className="about-avatar-fallback">{member.avatar}</span>
                </div>
                <h3 className="about-card-title">{member.name}</h3>
                <div className="about-badge">{member.role}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="about-cta">
          <h2 className="about-cta-title">
            Ready to Transform Your Booking Experience?
          </h2>
          <p className="about-cta-description">
            Join AppointMe today and step into the future of seamless,
            stress-free appointment scheduling.
          </p>
          <button className="about-cta-button">Get Started Now</button>
        </section>
      </div>
    </div>
  );
}
