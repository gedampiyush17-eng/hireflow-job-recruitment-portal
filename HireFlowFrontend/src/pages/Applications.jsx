import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { getMyApplications } from "../services/jobService";
import "../styles/applications.css";

function Applications() {
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem("token");

        if (!token) {
          setError(
            "You are not logged in."
          );
          return;
        }

        const user = jwtDecode(token);

        if (!user.id) {
          setError(
            "Unable to identify your account."
          );
          return;
        }

        const data =
          await getMyApplications(user.id);

        setApplications(data);
      } catch (error) {
        console.error(
          "Failed to load applications:",
          error
        );

        if (error.response?.data?.error) {
          setError(
            error.response.data.error
          );
        } else if (
          error.response?.data?.message
        ) {
          setError(
            error.response.data.message
          );
        } else {
          setError(
            "Failed to load your applications."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusClass = (status) => {
    if (!status) {
      return "applied";
    }

    return status
      .toLowerCase()
      .replace("_", "-");
  };

  const getStatusText = (status) => {
    if (!status) {
      return "APPLIED";
    }

    if (status === "INTERVIEWING") {
      return "INTERVIEWING";
    }

    if (status === "OFFERED") {
      return "OFFERED";
    }

    if (status === "REJECTED") {
      return "REJECTED";
    }

    return status;
  };

  if (loading) {
    return (
      <div className="applications-page">
        <div className="applications-state">
          <h2>
            Loading your applications...
          </h2>

          <p>
            Please wait while we fetch your
            applications.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="applications-page">
        <div className="applications-state error-state">
          <h2>
            Unable to load applications
          </h2>

          <p>{error}</p>

          <Link
            to="/dashboard"
            className="applications-back-btn"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="applications-page">
      <div className="applications-container">

        <div className="applications-header">

          <div>
            <p className="applications-label">
              CAREER
            </p>

            <h1>
              My Applications
            </h1>

            <p>
              Track the jobs you have applied
              for and check your application
              status.
            </p>
          </div>

          <Link
            to="/jobs"
            className="browse-jobs-btn"
          >
            Find More Jobs
          </Link>

        </div>

        <div className="applications-summary">

          <div className="application-summary-card">

            <div className="summary-icon">
              📋
            </div>

            <div>
              <strong>
                {applications.length}
              </strong>

              <p>
                Total Applications
              </p>
            </div>

          </div>

          <div className="application-summary-card">

            <div className="summary-icon">
              🔵
            </div>

            <div>
              <strong>
                {
                  applications.filter(
                    (item) =>
                      item.application
                        ?.applicationStatus ===
                      "INTERVIEWING"
                  ).length
                }
              </strong>

              <p>
                Interviews
              </p>
            </div>

          </div>

          <div className="application-summary-card">

            <div className="summary-icon">
              🟢
            </div>

            <div>
              <strong>
                {
                  applications.filter(
                    (item) =>
                      item.application
                        ?.applicationStatus ===
                      "OFFERED"
                  ).length
                }
              </strong>

              <p>
                Offers
              </p>
            </div>

          </div>

          <div className="application-summary-card">

            <div className="summary-icon">
              🔴
            </div>

            <div>
              <strong>
                {
                  applications.filter(
                    (item) =>
                      item.application
                        ?.applicationStatus ===
                      "REJECTED"
                  ).length
                }
              </strong>

              <p>
                Rejected
              </p>
            </div>

          </div>

        </div>

        {applications.length === 0 ? (

          <div className="no-applications">

            <div className="no-applications-icon">
              📋
            </div>

            <h2>
              No applications yet
            </h2>

            <p>
              You haven't applied to any jobs
              yet. Start exploring opportunities
              and apply for your next job.
            </p>

            <Link
              to="/jobs"
              className="browse-jobs-empty-btn"
            >
              Browse Jobs
            </Link>

          </div>

        ) : (

          <div className="applications-list">

            {applications.map(
              (item, index) => {

                const job = item.job;

                const application =
                  item.application;

                return (

                  <div
                    className="application-card"
                    key={`${job.id}-${application.applicantId}-${index}`}
                  >

                    <div className="application-card-main">

                      <div className="application-company-icon">
                        {job.company
                          ? job.company
                              .charAt(0)
                              .toUpperCase()
                          : "C"}
                      </div>

                      <div className="application-info">

                        <div className="application-title-row">

                          <h2>
                            {job.jobTitle}
                          </h2>

                          <span
                            className={`application-card-status ${getStatusClass(
                              application.applicationStatus
                            )}`}
                          >
                            {getStatusText(
                              application.applicationStatus
                            )}
                          </span>

                        </div>

                        <p className="application-company">
                          {job.company ||
                            "Company"}
                        </p>

                        <div className="application-meta">

                          <span>
                            📍{" "}
                            {job.location ||
                              "Location not specified"}
                          </span>

                          <span>
                            💼{" "}
                            {job.jobType ||
                              "Not specified"}
                          </span>

                          {job.packageOffered && (
                            <span>
                              💰 ₹
                              {job.packageOffered.toLocaleString(
                                "en-IN"
                              )}
                            </span>
                          )}

                        </div>

                      </div>

                    </div>

                    <div className="application-card-bottom">

                      <div className="application-date">

                        <span>
                          Applied On
                        </span>

                        <strong>
                          {application.timeStamp
                            ? new Date(
                                application.timeStamp
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "Not available"}
                        </strong>

                      </div>

                      {application.applicationStatus ===
                        "INTERVIEWING" &&
                        application.interviewTime && (

                          <div className="interview-time">

                            <span>
                              Interview
                            </span>

                            <strong>
                              {new Date(
                                application.interviewTime
                              ).toLocaleString(
                                "en-IN"
                              )}
                            </strong>

                          </div>

                        )}

                      <Link
                        to={`/jobs/${job.id}`}
                        className="view-application-btn"
                      >
                        View Job →
                      </Link>

                    </div>

                  </div>

                );
              }
            )}

          </div>

        )}

      </div>
    </div>
  );
}

export default Applications;