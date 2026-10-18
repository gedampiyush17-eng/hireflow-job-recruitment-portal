import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { postJob } from "../services/jobService";
import "../styles/postJob.css";

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    about: "",
    experience: "",
    jobType: "",
    location: "",
    packageOffered: "",
    description: "",
    skillRequired: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const user = jwtDecode(token);

      const jobData = {
        jobTitle: formData.jobTitle,
        company: formData.company,
        about: formData.about,
        experience: formData.experience,
        jobType: formData.jobType,
        location: formData.location,
        packageOffered: Number(
          formData.packageOffered
        ),
        description: formData.description,
        skillRequired: formData.skillRequired
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
        postedBy: user.id,
      };

      await postJob(jobData);

      setSuccess(
        "Job posted successfully!"
      );

      setFormData({
        jobTitle: "",
        company: "",
        about: "",
        experience: "",
        jobType: "",
        location: "",
        packageOffered: "",
        description: "",
        skillRequired: "",
      });
    } catch (error) {
      console.error(error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Failed to post the job. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-page">

      <div className="post-job-container">

        <div className="post-job-header">

          <p className="post-job-label">
            EMPLOYER
          </p>

          <h1>
            Post a New Job
          </h1>

          <p>
            Find talented candidates for your
            organization by creating a job posting.
          </p>

        </div>


        <div className="post-job-card">

          {error && (
            <div className="post-job-error">
              {error}
            </div>
          )}

          {success && (
            <div className="post-job-success">
              {success}
            </div>
          )}


          <form onSubmit={handleSubmit}>

            <div className="post-job-section">

              <h2>
                Job Information
              </h2>

              <div className="post-job-grid">

                <div className="post-job-form-group">

                  <label>
                    Job Title
                  </label>

                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    placeholder="e.g. Java Backend Developer"
                    required
                  />

                </div>


                <div className="post-job-form-group">

                  <label>
                    Company
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g. ABC Technologies"
                    required
                  />

                </div>


                <div className="post-job-form-group">

                  <label>
                    Experience
                  </label>

                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="e.g. 0-2 years"
                    required
                  />

                </div>


                <div className="post-job-form-group">

                  <label>
                    Job Type
                  </label>

                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select job type
                    </option>

                    <option value="FULL_TIME">
                      Full Time
                    </option>

                    <option value="PART_TIME">
                      Part Time
                    </option>

                    <option value="INTERNSHIP">
                      Internship
                    </option>

                    <option value="CONTRACT">
                      Contract
                    </option>
                  </select>

                </div>


                <div className="post-job-form-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Nagpur / Remote"
                    required
                  />

                </div>


                <div className="post-job-form-group">

                  <label>
                    Package Offered
                  </label>

                  <input
                    type="number"
                    name="packageOffered"
                    value={formData.packageOffered}
                    onChange={handleChange}
                    placeholder="e.g. 700000"
                    min="0"
                    required
                  />

                  <small>
                    Enter annual package in your
                    backend's expected numeric format.
                  </small>

                </div>

              </div>

            </div>


            <div className="post-job-section">

              <h2>
                About the Job
              </h2>

              <div className="post-job-form-group">

                <label>
                  About Company / Role
                </label>

                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  placeholder="Tell candidates about the company or role..."
                  rows="5"
                  required
                />

              </div>


              <div className="post-job-form-group">

                <label>
                  Job Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the responsibilities, requirements, and expectations..."
                  rows="7"
                  required
                />

              </div>


              <div className="post-job-form-group">

                <label>
                  Required Skills
                </label>

                <input
                  type="text"
                  name="skillRequired"
                  value={formData.skillRequired}
                  onChange={handleChange}
                  placeholder="Java, Spring Boot, SQL, MongoDB"
                  required
                />

                <small>
                  Separate skills with commas.
                </small>

              </div>

            </div>


            <div className="post-job-actions">

              <button
                type="button"
                className="cancel-job-btn"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="submit-job-btn"
                disabled={loading}
              >
                {loading
                  ? "Posting..."
                  : "Post Job"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default PostJob;