import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/auth.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountType, setAccountType] = useState("APPLICANT");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await registerUser({
        name,
        email,
        password,
        accountType,
      });

      alert("Registration successful!");

      navigate("/login");
    } catch (error) {
      console.error(error);

      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError("Registration failed");
      }
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>
          Create Account
        </h1>

        <p className="auth-subtitle">
          Join HireFlow today
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Create a password"
              required
            />

          </div>

          <div className="form-group">

            <label>
              Account Type
            </label>

            <select
              value={accountType}
              onChange={(e) =>
                setAccountType(e.target.value)
              }
            >
              <option value="APPLICANT">
                Applicant
              </option>

              <option value="EMPLOYER">
                Employer
              </option>
            </select>

          </div>

          <button
            className="primary-btn"
            type="submit"
          >
            Create Account
          </button>

        </form>

        <p className="auth-link">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default Register;