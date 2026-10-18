import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
  applyForJob,
  getJobById,
} from "../services/jobService";
import "../styles/jobDetails.css";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");
  const [applyMessage, setApplyMessage] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const data = await getJobById(id);

        setJob(data);
      } catch (error) {
        console.error(error);

        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    setApplying(true);
    setApplyMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const user = jwtDecode(token);

      if (!user.id) {
        setError("Unable to identify your account.");
        return;
      }

      const applicantData = {
        applicantId: user.id,
        name: user.name,
        email: user.sub,
      };

      const response = await applyForJob(
        id,
        applicantData
      );

      setApplyMessage(
        response?.message ||
          "Application submitted successfully!"
      );
    } catch (error) {
      console.error(error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Failed to apply for this job. Please try again."
        );
      }
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="job-details-state">
          <h2>Loading job...</h2>

          <p>
            Please wait while we load the job details.
          </p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="job-details-page">
        <div className="job-details-state error-state">
          <h2>Unable to load job</h2>

          <p>{error}</p>

          <button
            className="back-btn"
            onClick={() => navigate("/jobs")}
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="job-details-state">
          <h2>Job not found</h2>

          <Link
            to="/jobs"
            className="back-btn"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <div className="job-details-container">

        <Link
          to="/jobs"
          className="back-to-jobs"
        >
          ← Back to Jobs
        </Link>

        <div className="job-details-layout">

          <main className="job-details-main">

            <div className="job-details-header">

              <div className="job-company-icon">
                {job.company
                  ? job.company
                      .charAt(0)
                      .toUpperCase()
                  : "C"}
              </div>

              <div className="job-details-title">

                <div className="job-title-row">

                  <h1>
                    {job.jobTitle}
                  </h1>

                  <span className="job-details-status">
                    {job.jobStatus || "OPEN"}
                  </span>

                </div>

                <p className="job-details-company">
                  {job.company || "Company"}
                </p>

              </div>

            </div>

            <div className="job-meta">

              <div className="job-meta-item">

                <span>📍</span>

                <div>
                  <strong>
                    Location
                  </strong>

                  <p>
                    {job.location ||
                      "Not specified"}
                  </p>
                </div>

              </div>

              <div className="job-meta-item">

                <span>💰</span>

                <div>
                  <strong>
                    Salary
                  </strong>

                  <p>
                    {job.packageOffered
                      ? `₹${job.packageOffered.toLocaleString(
                          "en-IN"
                        )}`
                      : "Not specified"}
                  </p>
                </div>

              </div>

              <div className="job-meta-item">

                <span>💼</span>

                <div>
                  <strong>
                    Job Type
                  </strong>

                  <p>
                    {job.jobType ||
                      "Not specified"}
                  </p>
                </div>

              </div>

            </div>

            <section className="job-description-section">

              <h2>
                About the Role
              </h2>

              <p>
                {job.about ||
                  "No information provided."}
              </p>

            </section>

            <section className="job-description-section">

              <h2>
                Job Description
              </h2>

              <p>
                {job.description ||
                  "No job description provided."}
              </p>

            </section>

            {job.skillRequired &&
              job.skillRequired.length > 0 && (
                <section className="job-description-section">

                  <h2>
                    Required Skills
                  </h2>

                  <div className="skills-list">

                    {job.skillRequired.map(
                      (skill, index) => (
                        <span
                          className="skill-tag"
                          key={index}
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>

                </section>
              )}

          </main>

          <aside className="job-details-sidebar">

            <div className="apply-card">

              <h2>
                Interested in this job?
              </h2>

              <p>
                Apply now and take the next
                step in your career.
              </p>

              {applyMessage && (
                <div className="apply-success">
                  {applyMessage}
                </div>
              )}

              {error && job && (
                <div className="apply-error">
                  {error}
                </div>
              )}

              <button
                className="apply-btn"
                onClick={handleApply}
                disabled={
                  applying ||
                  !!applyMessage
                }
              >
                {applying
                  ? "Applying..."
                  : applyMessage
                    ? "Application Submitted"
                    : "Apply Now"}
              </button>

            </div>

          </aside>

        </div>

      </div>
    </div>
  );
}

export default JobDetails;