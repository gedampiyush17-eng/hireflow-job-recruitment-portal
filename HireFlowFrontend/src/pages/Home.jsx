import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/home.css";

function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">

      <section className="hero-section">

        <div className="hero-content">

          <span className="hero-badge">
            🚀 Find your next opportunity
          </span>

          <h1>
            Build Your Career.
            <br />
            <span>
              Find Your Future.
            </span>
          </h1>

          <p>
            HireFlow connects talented people
            with great companies. Discover jobs,
            apply with ease, and take the next
            step in your career.
          </p>

          <div className="hero-buttons">

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="hero-primary-btn"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="hero-primary-btn"
                >
                  Get Started
                </Link>

                <Link
                  to="/login"
                  className="hero-secondary-btn"
                >
                  Login
                </Link>
              </>
            )}

          </div>

        </div>

      </section>


      <section className="features-section">

        <div className="section-heading">

          <h2>
            Everything you need to get hired
          </h2>

          <p>
            A simple platform for candidates
            and employers.
          </p>

        </div>


        <div className="features-grid">

          <div className="feature-card">

            <div className="feature-icon">
              🔍
            </div>

            <h3>
              Find Jobs
            </h3>

            <p>
              Search and discover opportunities
              that match your skills and career
              goals.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              📄
            </div>

            <h3>
              Easy Applications
            </h3>

            <p>
              Apply to jobs quickly and keep
              track of your applications from
              one place.
            </p>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🏢
            </div>

            <h3>
              For Employers
            </h3>

            <p>
              Post job opportunities and find
              talented candidates for your
              organization.
            </p>

          </div>

        </div>

      </section>


      <section className="cta-section">

        <h2>
          Ready to take the next step?
        </h2>

        <p>
          Join HireFlow and start building
          your future today.
        </p>

        {!isAuthenticated && (
          <Link
            to="/register"
            className="hero-primary-btn"
          >
            Create Your Account
          </Link>
        )}

      </section>

    </div>
  );
}

export default Home;