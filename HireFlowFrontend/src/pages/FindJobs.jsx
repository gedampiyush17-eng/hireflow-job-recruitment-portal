import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllJobs } from "../services/jobService";
import "../styles/jobs.css";

function FindJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();

        setJobs(data);
      } catch (error) {
        console.error(error);

        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const searchText = search.toLowerCase();

    return (
      job.jobTitle?.toLowerCase().includes(searchText) ||
      job.company?.toLowerCase().includes(searchText) ||
      job.location?.toLowerCase().includes(searchText)
    );
  });

  if (loading) {
    return (
      <div className="jobs-page">
        <div className="jobs-loading">
          <h2>Loading jobs...</h2>
          <p>Finding opportunities for you.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs-page">
        <div className="jobs-error">
          <h2>Something went wrong</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs-page">
      <section className="jobs-header">
        <div>
          <p className="jobs-header-label">
            CAREER OPPORTUNITIES
          </p>

          <h1>Find Your Next Job</h1>

          <p>
            Discover opportunities that match your skills
            and career goals.
          </p>
        </div>
      </section>

      <section className="jobs-search-section">
        <input
          type="text"
          placeholder="Search by job title, company, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </section>

      <section className="jobs-content">
        <div className="jobs-result-header">
          <h2>
            Available Jobs
          </h2>

          <span>
            {filteredJobs.length} jobs found
          </span>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="no-jobs">
            <div className="no-jobs-icon">
              🔍
            </div>

            <h3>No jobs found</h3>

            <p>
              Try changing your search or check back later
              for new opportunities.
            </p>
          </div>
        ) : (
          <div className="jobs-grid">
            {filteredJobs.map((job) => (
              <div
                className="job-card"
                key={job.id}
              >
                <div className="job-card-top">
                  <div className="company-icon">
                    {job.company
                      ? job.company.charAt(0).toUpperCase()
                      : "C"}
                  </div>

                  <span className="job-status">
                    {job.jobStatus || "OPEN"}
                  </span>
                </div>

                <h3>{job.jobTitle}</h3>

                <p className="job-company">
                  {job.company || "Company"}
                </p>

                <div className="job-details">
                  <span>
                    📍 {job.location || "Location not specified"}
                  </span>

                  {job.packageOffered && (
                    <span>
                      💰 ₹
                      {job.packageOffered.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {job.description && (
                  <p className="job-description">
                    {job.description.length > 120
                      ? `${job.description.substring(0, 120)}...`
                      : job.description}
                  </p>
                )}

                <Link
                  to={`/jobs/${job.id}`}
                  className="view-job-btn"
                >
                  View Job
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default FindJobs;