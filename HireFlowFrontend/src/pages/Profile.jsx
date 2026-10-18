import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  getProfile,
  updateProfile,
} from "../services/profileService";
import "../styles/profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    jobTitle: "",
    company: "",
    location: "",
    about: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("You are not logged in.");
          return;
        }

        const decodedToken = jwtDecode(token);

        if (!decodedToken.profileId) {
          setError(
            "Profile information could not be found."
          );
          return;
        }

        const profileData = await getProfile(
          decodedToken.profileId
        );

        setProfile(profileData);

        setFormData({
          id: profileData.id,
          name: profileData.name || "",
          email: profileData.email || "",
          jobTitle: profileData.jobTitle || "",
          company: profileData.company || "",
          location: profileData.location || "",
          about: profileData.about || "",
        });
      } catch (error) {
        console.error(error);

        if (error.response?.data?.error) {
          setError(error.response.data.error);
        } else if (error.response?.data?.message) {
          setError(error.response.data.message);
        } else {
          setError("Failed to load profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  };

  const handleEdit = () => {
    setEditing(true);
    setSuccess("");
    setError("");
  };

  const handleCancel = () => {
    if (!profile) {
      return;
    }

    setFormData({
      id: profile.id,
      name: profile.name || "",
      email: profile.email || "",
      jobTitle: profile.jobTitle || "",
      company: profile.company || "",
      location: profile.location || "",
      about: profile.about || "",
    });

    setEditing(false);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const updatedProfile = await updateProfile(
        formData
      );

      setProfile(updatedProfile);

      setFormData({
        id: updatedProfile.id,
        name: updatedProfile.name || "",
        email: updatedProfile.email || "",
        jobTitle: updatedProfile.jobTitle || "",
        company: updatedProfile.company || "",
        location: updatedProfile.location || "",
        about: updatedProfile.about || "",
      });

      setEditing(false);

      setSuccess(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error(error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError(
          "Failed to update profile."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-state">
          <h2>Loading profile...</h2>
          <p>
            Please wait while we load your profile.
          </p>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="profile-state error-state">
          <h2>Unable to load profile</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        <div className="profile-header">

          <div>
            <p className="profile-label">
              MY PROFILE
            </p>

            <h1>
              {editing
                ? "Edit Profile"
                : "My Profile"}
            </h1>

            <p>
              Manage your professional information
              and keep your profile up to date.
            </p>
          </div>

          {!editing && (
            <button
              className="edit-profile-btn"
              onClick={handleEdit}
            >
              ✏️ Edit Profile
            </button>
          )}

        </div>

        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        {success && (
          <div className="profile-success">
            {success}
          </div>
        )}

        <div className="profile-card">

          <div className="profile-card-header">

            <div className="profile-avatar">
              {formData.name
                ? formData.name
                    .charAt(0)
                    .toUpperCase()
                : "U"}
            </div>

            <div>
              <h2>
                {formData.name ||
                  "Your Name"}
              </h2>

              <p>
                {formData.jobTitle ||
                  "Professional"}
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="profile-section">

              <h3>
                Basic Information
              </h3>

              <div className="profile-grid">

                <div className="profile-form-group">

                  <label>
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Enter your name"
                    required
                  />

                </div>

                <div className="profile-form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                  />

                  <small>
                    Email is managed by your account.
                  </small>

                </div>

                <div className="profile-form-group">

                  <label>
                    Job Title
                  </label>

                  <input
                    type="text"
                    name="jobTitle"
                    value={formData.jobTitle}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="e.g. Java Developer"
                  />

                </div>

                <div className="profile-form-group">

                  <label>
                    Company
                  </label>

                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="e.g. ABC Technologies"
                  />

                </div>

                <div className="profile-form-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="e.g. Nagpur, India"
                  />

                </div>

              </div>

            </div>

            <div className="profile-section">

              <h3>
                About Me
              </h3>

              <div className="profile-form-group">

                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Tell employers about yourself..."
                  rows="6"
                />

              </div>

            </div>

            {editing && (
              <div className="profile-actions">

                <button
                  type="button"
                  className="cancel-profile-btn"
                  onClick={handleCancel}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-profile-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>

              </div>
            )}

          </form>

        </div>

      </div>
    </div>
  );
}

export default Profile;