import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  changeApplicationStatus,
  getJobById,
} from "../services/jobService";
import "../styles/applicants.css";

function Applicants() {
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [selectedApplicant, setSelectedApplicant] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getJobById(id);

        setJob(data);

        if (data.applicants?.length > 0) {
          setSelectedApplicant(data.applicants[0]);
        }
      } catch (error) {
        console.error(
          "Failed to load applicants:",
          error
        );

        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError(
            "Failed to load applicants. Please try again."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const updateApplicationStatus = async (
    applicant,
    status
  ) => {
    try {
      setUpdating(true);
      setError("");
      setSuccess("");

      const applicationData = {
        id: Number(id),
        applicantId: applicant.applicantId,
        applicationStatus: status,
      };

      console.log(
        "Updating application status:",
        applicationData
      );

      await changeApplicationStatus(
        applicationData
      );

      const updatedApplicants =
        (job.applicants || []).map((item) => {
          if (
            item.applicantId ===
            applicant.applicantId
          ) {
            return {
              ...item,
              applicationStatus: status,
            };
          }

          return item;
        });

      const updatedJob = {
        ...job,
        applicants: updatedApplicants,
      };

      setJob(updatedJob);

      setSelectedApplicant({
        ...applicant,
        applicationStatus: status,
      });

      if (status === "OFFERED") {
        setSuccess(
          "Job offer sent successfully."
        );
      } else if (status === "INTERVIEWING") {
        setSuccess(
          "Applicant moved to interview stage successfully."
        );
      } else if (status === "REJECTED") {
        setSuccess(
          "Applicant rejected successfully."
        );
      }
    } catch (error) {
      console.error(
        "Failed to update application status:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (
        typeof error.response?.data === "string"
      ) {
        setError(error.response.data);
      } else {
        setError(
          `Failed to update application status to ${status}.`
        );
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="applicants-page">
        <div className="applicants-state">
          <h2>Loading applicants...</h2>

          <p>
            Fetching candidates for this job.
          </p>
        </div>
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className="applicants-page">
        <div className="applicants-state">
          <h2>
            Unable to load applicants
          </h2>

          <p>{error}</p>

          <Link
            to="/posted-jobs"
            className="back-to-jobs"
          >
            ← Back to My Jobs
          </Link>
        </div>
      </div>
    );
  }

  const applicants = job?.applicants || [];

  return (
    <div className="applicants-page">
      <div className="applicants-container">

        <Link
          to="/posted-jobs"
          className="back-to-jobs"
        >
          ← Back to My Jobs
        </Link>

        <div className="applicants-header">
          <div>
            <p className="applicants-label">
              RECRUITMENT
            </p>

            <h1>Applicants</h1>

            <p>
              Candidates who applied for{" "}
              <strong>
                {job?.jobTitle}
              </strong>
            </p>
          </div>
        </div>

        {error && (
          <div className="applicants-error">
            {error}
          </div>
        )}

        {success && (
          <div className="applicants-success">
            {success}
          </div>
        )}

        {applicants.length === 0 ? (
          <div className="no-applicants">

            <div className="no-applicants-icon">
              👥
            </div>

            <h2>
              No applicants yet
            </h2>

            <p>
              Applicants will appear here when
              candidates apply for this job.
            </p>

          </div>
        ) : (
          <div className="applicants-layout">

            <div className="applicant-list">

              <div className="applicant-list-header">
                <h2>
                  Applicants
                </h2>

                <span>
                  {applicants.length}
                </span>
              </div>

              {applicants.map((applicant) => (
                <button
                  key={applicant.applicantId}
                  className={`applicant-list-item ${
                    selectedApplicant?.applicantId ===
                    applicant.applicantId
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedApplicant(applicant);
                    setError("");
                    setSuccess("");
                  }}
                >
                  <div className="applicant-avatar">
                    {applicant.name
                      ? applicant.name
                          .charAt(0)
                          .toUpperCase()
                      : "A"}
                  </div>

                  <div className="applicant-list-info">
                    <h3>
                      {applicant.name ||
                        "Applicant"}
                    </h3>

                    <p>
                      {applicant.email ||
                        "No email"}
                    </p>
                  </div>

                  <span
                    className={`application-status ${
                      applicant.applicationStatus
                        ?.toLowerCase()
                        .replace("_", "-") ||
                      "applied"
                    }`}
                  >
                    {applicant.applicationStatus ||
                      "APPLIED"}
                  </span>
                </button>
              ))}

            </div>

            {selectedApplicant && (
              <div className="applicant-details">

                <div className="applicant-profile-header">

                  <div className="large-applicant-avatar">
                    {selectedApplicant.name
                      ? selectedApplicant.name
                          .charAt(0)
                          .toUpperCase()
                      : "A"}
                  </div>

                  <div>
                    <h2>
                      {selectedApplicant.name ||
                        "Applicant"}
                    </h2>

                    <p>
                      {selectedApplicant.email ||
                        "No email"}
                    </p>
                  </div>

                </div>

                <div className="applicant-information">

                  <div className="applicant-info-item">
                    <span>
                      Email
                    </span>

                    <strong>
                      {selectedApplicant.email ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="applicant-info-item">
                    <span>
                      Phone
                    </span>

                    <strong>
                      {selectedApplicant.phone ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="applicant-info-item">
                    <span>
                      Website
                    </span>

                    <strong>
                      {selectedApplicant.website ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="applicant-info-item">
                    <span>
                      Applied On
                    </span>

                    <strong>
                      {selectedApplicant.timeStamp
                        ? new Date(
                            selectedApplicant.timeStamp
                          ).toLocaleDateString(
                            "en-IN"
                          )
                        : "Not available"}
                    </strong>
                  </div>

                </div>

                {selectedApplicant.coverLetter && (
                  <div className="applicant-section">

                    <h3>
                      Cover Letter
                    </h3>

                    <p>
                      {
                        selectedApplicant.coverLetter
                      }
                    </p>

                  </div>
                )}

                <div className="applicant-actions">

                  <h3>
                    Application Decision
                  </h3>

                  <div className="action-buttons">

                    <button
                      className="accept-btn"
                      disabled={updating}
                      onClick={() =>
                        updateApplicationStatus(
                          selectedApplicant,
                          "OFFERED"
                        )
                      }
                    >
                      ✓ Offer
                    </button>

                    <button
                      className="interview-btn"
                      disabled={updating}
                      onClick={() =>
                        updateApplicationStatus(
                          selectedApplicant,
                          "INTERVIEWING"
                        )
                      }
                    >
                      📅 Interview
                    </button>

                    <button
                      className="reject-btn"
                      disabled={updating}
                      onClick={() =>
                        updateApplicationStatus(
                          selectedApplicant,
                          "REJECTED"
                        )
                      }
                    >
                      ✕ Reject
                    </button>

                  </div>

                </div>

              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Applicants;