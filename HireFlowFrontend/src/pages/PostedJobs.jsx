import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import { getPostedJobs } from "../services/jobService";
import "../styles/postedJobs.css";

function PostedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPostedJobs = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You are not logged in.");
          return;
        }

        const user = jwtDecode(token);

        const data = await getPostedJobs(user.id);

        setJobs(data || []);
      } catch (error) {
        console.error(error);

        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError(
            "Failed to load your posted jobs."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPostedJobs();
  }, []);

  if (loading) {
    return (
      <div className="posted-jobs-page">
        <div className="posted-jobs-state">
          <h2>Loading your jobs...</h2>
          <p>
            Please wait while we fetch your job postings.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="posted-jobs-page">
        <div className="posted-jobs-state error-state">
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="posted-jobs-page">
      <div className="posted-jobs-container">

        <div className="posted-jobs-header">

          <div>
            <p className="posted-jobs-label">
              EMPLOYER
            </p>

            <h1>My Posted Jobs</h1>

            <p>
              Manage the job opportunities you have posted.
            </p>
          </div>

          <Link
            to="/post-job"
            className="post-new-job-btn"
          >
            + Post New Job
          </Link>

        </div>

        <div className="posted-jobs-summary">

          <div className="summary-card">
            <span className="summary-icon">
              💼
            </span>

            <div>
              <strong>{jobs.length}</strong>

              <p>
                {jobs.length === 1
                  ? "Job Posted"
                  : "Jobs Posted"}
              </p>
            </div>
          </div>

          <div className="summary-card">
            <span className="summary-icon">
              🟢
            </span>

            <div>
              <strong>
                {
                  jobs.filter(
                    (job) =>
                      job.jobStatus === "OPEN"
                  ).length
                }
              </strong>

              <p>Open Jobs</p>
            </div>
          </div>

          <div className="summary-card">
            <span className="summary-icon">
              👥
            </span>

            <div>
              <strong>
                {jobs.reduce(
                  (total, job) =>
                    total +
                    (job.applicants?.length || 0),
                  0
                )}
              </strong>

              <p>Total Applicants</p>
            </div>
          </div>

        </div>

        {jobs.length === 0 ? (
          <div className="no-posted-jobs">

            <div className="no-posted-jobs-icon">
              💼
            </div>

            <h2>
              No jobs posted yet
            </h2>

            <p>
              Create your first job posting and start
              finding talented candidates.
            </p>

            <Link
              to="/post-job"
              className="post-first-job-btn"
            >
              Post Your First Job
            </Link>

          </div>
        ) : (
          <div className="posted-jobs-list">

            {jobs.map((job) => (
              <div
                className="posted-job-card"
                key={job.id}
              >

                <div className="posted-job-main">

                  <div className="posted-job-icon">
                    {job.company
                      ? job.company
                          .charAt(0)
                          .toUpperCase()
                      : "C"}
                  </div>

                  <div className="posted-job-info">

                    <div className="posted-job-title-row">

                      <h2>
                        {job.jobTitle}
                      </h2>

                      <span
                        className={`posted-job-status ${
                          job.jobStatus === "OPEN"
                            ? "status-open"
                            : "status-closed"
                        }`}
                      >
                        {job.jobStatus || "OPEN"}
                      </span>

                    </div>

                    <p className="posted-job-company">
                      {job.company || "Company"}
                    </p>

                    <div className="posted-job-meta">

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

                      <span>
                        💰 ₹
                        {job.packageOffered
                          ? job.packageOffered.toLocaleString(
                              "en-IN"
                            )
                          : "Not specified"}
                      </span>

                    </div>

                  </div>

                </div>

                <div className="posted-job-bottom">

                  <Link
                    to={`/jobs/${job.id}/applicants`}
                    className="applicant-count applicant-link"
                  >
                    👥{" "}
                    <strong>
                      {job.applicants?.length || 0}
                    </strong>{" "}
                    {job.applicants?.length === 1
                      ? "Applicant"
                      : "Applicants"}{" "}
                    →
                  </Link>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="view-posted-job-btn"
                  >
                    View Job →
                  </Link>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default PostedJobs;