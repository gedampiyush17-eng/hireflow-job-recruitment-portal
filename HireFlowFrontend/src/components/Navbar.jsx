import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/AuthContext";
import { getNotifications } from "../services/notificationService";
import "../styles/navbar.css";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [unreadCount, setUnreadCount] =
    useState(0);

  const loadUnreadNotifications = async () => {
    try {
      const token =
        localStorage.getItem("token");

      if (!token) {
        setUnreadCount(0);
        return;
      }

      const user = jwtDecode(token);

      if (!user.id) {
        setUnreadCount(0);
        return;
      }

      const notifications =
        await getNotifications(user.id);

      const unread =
        (notifications || []).filter(
          (notification) =>
            notification.status !== "READ"
        ).length;

      setUnreadCount(unread);
    } catch (error) {
      console.error(
        "Failed to load notification count:",
        error
      );

      setUnreadCount(0);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    loadUnreadNotifications();

    const handleNotificationUpdate = () => {
      loadUnreadNotifications();
    };

    window.addEventListener(
      "notificationsUpdated",
      handleNotificationUpdate
    );

    const interval = setInterval(
      loadUnreadNotifications,
      30000
    );

    return () => {
      window.removeEventListener(
        "notificationsUpdated",
        handleNotificationUpdate
      );

      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setUnreadCount(0);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link
          to="/"
          className="navbar-logo"
        >
          HireFlow
        </Link>

        <div className="navbar-links">

          <Link to="/">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/jobs">
                Find Jobs
              </Link>

              <Link to="/dashboard">
                Dashboard
              </Link>

              <Link to="/profile">
                Profile
              </Link>

              <Link
                to="/notifications"
                className="notification-nav-link"
                style={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🔔

                {unreadCount > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-8px",
                      right: "-10px",
                      minWidth: "18px",
                      height: "18px",
                      padding: "0 5px",
                      borderRadius: "999px",
                      background: "#ef4444",
                      color: "white",
                      fontSize: "11px",
                      fontWeight: "700",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      lineHeight: "1",
                    }}
                  >
                    {unreadCount > 99
                      ? "99+"
                      : unreadCount}
                  </span>
                )}
              </Link>

              <button
                className="navbar-logout"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">
                Login
              </Link>

              <Link
                to="/register"
                className="navbar-register"
              >
                Register
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
}

export default Navbar;