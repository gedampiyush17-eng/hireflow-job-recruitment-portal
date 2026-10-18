import { useMemo } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const token = localStorage.getItem("token");

  const user = useMemo(() => {
    if (!token) {
      return null;
    }

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error("Invalid token:", error);

      return null;
    }
  }, [token]);

  if (!user) {
    return (
      <div className="dashboard-page">

        <div className="dashboard-error">

          <h2>
            Unable to load dashboard
          </h2>

          <p>
            Please login again.
          </p>

        </div>

      </div>
    );
  }

  const isApplicant =
    user.accountType === "APPLICANT";

  const isEmployer =
    user.accountType === "EMPLOYER";

  return (
    <div className="dashboard-page">

      <section className="dashboard-header">

        <div>

          <p className="dashboard-welcome">
            Welcome back 👋
          </p>

          <h1>
            {user.name || "User"}
          </h1>

          <p className="dashboard-email">
            {user.email}
          </p>

        </div>

        <div className="account-badge">
          {isApplicant
            ? "Applicant"
            : "Employer"}
        </div>

      </section>


      {isApplicant && (
        <>

          <section className="dashboard-section">

            <div className="dashboard-section-heading">

              <h2>
                Applicant Dashboard
              </h2>

              <p>
                Find opportunities and manage
                your job applications.
              </p>

            </div>


            <div className="dashboard-grid">

              <Link
                to="/jobs"
                className="dashboard-card"
              >

                <div className="dashboard-card-icon">
                  🔍
                </div>

                <h3>
                  Find Jobs
                </h3>

                <p>
                  Explore available jobs and find
                  opportunities that match your skills.
                </p>

                <span>
                  Browse Jobs →
                </span>

              </Link>


              <Link
                to="/applications"
                className="dashboard-card"
              >

                <div className="dashboard-card-icon">
                  📋
                </div>

                <h3>
                  My Applications
                </h3>

                <p>
                  Track the jobs you have applied
                  for and check their current status.
                </p>

                <span>
                  View Applications →
                </span>

              </Link>


              <Link
                to="/profile"
                className="dashboard-card"
              >

                <div className="dashboard-card-icon">
                  👤
                </div>

                <h3>
                  My Profile
                </h3>

                <p>
                  Update your professional information
                  and keep your profile ready.
                </p>

                <span>
                  View Profile →
                </span>

              </Link>

            </div>

          </section>


          <section className="dashboard-stats">

            <div className="stat-card">

              <span className="stat-icon">
                📨
              </span>

              <div>

                <h3>
                  Applications
                </h3>

                <p>
                  Track your applications
                </p>

              </div>

            </div>


            <div className="stat-card">

              <span className="stat-icon">
                💼
              </span>

              <div>

                <h3>
                  Opportunities
                </h3>

                <p>
                  Discover new jobs
                </p>

              </div>

            </div>


            <div className="stat-card">

              <span className="stat-icon">
                ⭐
              </span>

              <div>

                <h3>
                  Profile
                </h3>

                <p>
                  Build your professional profile
                </p>

              </div>

            </div>

          </section>

        </>
      )}


      {isEmployer && (
        <>

          <section className="dashboard-section">

            <div className="dashboard-section-heading">

              <h2>
                Employer Dashboard
              </h2>

              <p>
                Post jobs and discover talented
                candidates.
              </p>

            </div>


            <div className="dashboard-grid">

              <Link
                to="/post-job"
                className="dashboard-card"
              >

                <div className="dashboard-card-icon">
                  ➕
                </div>

                <h3>
                  Post a Job
                </h3>

                <p>
                  Create a new job posting and start
                  attracting qualified candidates.
                </p>

                <span>
                  Post Job →
                </span>

              </Link>


              <Link
                to="/posted-jobs"
                className="dashboard-card"
              >

                <div className="dashboard-card-icon">
                  💼
                </div>

                <h3>
                  My Jobs
                </h3>

                <p>
                  View and manage the jobs you
                  have posted.
                </p>

                <span>
                  View Jobs →
                </span>

              </Link>


              <Link
                to="/profile"
                className="dashboard-card"
              >

                <div className="dashboard-card-icon">
                  🏢
                </div>

                <h3>
                  Company Profile
                </h3>

                <p>
                  Manage your company and employer
                  information.
                </p>

                <span>
                  View Profile →
                </span>

              </Link>

            </div>

          </section>


          <section className="dashboard-stats">

            <div className="stat-card">

              <span className="stat-icon">
                💼
              </span>

              <div>

                <h3>
                  Posted Jobs
                </h3>

                <p>
                  Manage your job postings
                </p>

              </div>

            </div>


            <div className="stat-card">

              <span className="stat-icon">
                👥
              </span>

              <div>

                <h3>
                  Candidates
                </h3>

                <p>
                  Review applicants
                </p>

              </div>

            </div>


            <div className="stat-card">

              <span className="stat-icon">
                📊
              </span>

              <div>

                <h3>
                  Recruitment
                </h3>

                <p>
                  Manage your hiring process
                </p>

              </div>

            </div>

          </section>

        </>
      )}

    </div>
  );
}

export default Dashboard;