import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";
import {
  getNotifications,
  markNotificationAsRead,
} from "../services/notificationService";
import "../styles/notifications.css";

function Notifications() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchNotifications = async () => {
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
        await getNotifications(user.id);

      setNotifications(data || []);
    } catch (error) {
      console.error(
        "Failed to load notifications:",
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
          "Failed to load notifications."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick =
    async (notification) => {
      try {
        if (
          notification.status !== "READ"
        ) {
          await markNotificationAsRead(
            notification.id
          );

          setNotifications((previous) =>
            previous.map((item) =>
              item.id === notification.id
                ? {
                    ...item,
                    status: "READ",
                  }
                : item
            )
          );

          window.dispatchEvent(
            new Event(
              "notificationsUpdated"
            )
          );
        }
      } catch (error) {
        console.error(
          "Failed to mark notification as read:",
          error
        );
      }
    };

  const getNotificationIcon = (
    notification
  ) => {
    const action =
      notification.action?.toLowerCase() ||
      "";

    const message =
      notification.message?.toLowerCase() ||
      "";

    if (
      action.includes("interview") ||
      message.includes("interview")
    ) {
      return "📅";
    }

    if (
      action.includes("reject") ||
      message.includes("reject")
    ) {
      return "❌";
    }

    if (
      action.includes("offer") ||
      message.includes("offer")
    ) {
      return "🎉";
    }

    return "🔔";
  };

  const getNotificationLink = (
    notification
  ) => {
    const action =
      notification.action?.toLowerCase() ||
      "";

    const message =
      notification.message?.toLowerCase() ||
      "";

    if (
      action.includes("interview") ||
      message.includes("interview") ||
      action.includes("offer") ||
      message.includes("offer") ||
      action.includes("reject") ||
      message.includes("reject")
    ) {
      return "/applications";
    }

    return "/applications";
  };

  const unreadCount =
    notifications.filter(
      (notification) =>
        notification.status !== "READ"
    ).length;

  if (loading) {
    return (
      <div className="notifications-page">
        <div className="notifications-state">
          <h2>
            Loading notifications...
          </h2>

          <p>
            Please wait while we load your
            notifications.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="notifications-page">
        <div className="notifications-state">
          <h2>
            Unable to load notifications
          </h2>

          <p>{error}</p>

          <Link
            to="/dashboard"
            className="notifications-back-btn"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-page">
      <div className="notifications-container">

        <div className="notifications-header">

          <div>
            <p className="notifications-label">
              UPDATES
            </p>

            <h1>
              Notifications
            </h1>

            <p>
              Stay updated about your job
              applications and interviews.
            </p>
          </div>

          {unreadCount > 0 && (
            <div className="unread-badge">
              {unreadCount} unread
            </div>
          )}

        </div>

        {notifications.length === 0 ? (
          <div className="no-notifications">

            <div className="no-notifications-icon">
              🔔
            </div>

            <h2>
              No notifications
            </h2>

            <p>
              You don't have any notifications
              right now.
            </p>

          </div>
        ) : (
          <div className="notifications-list">

            {notifications.map(
              (notification) => {

                const isUnread =
                  notification.status !==
                  "READ";

                const notificationLink =
                  getNotificationLink(
                    notification
                  );

                return (
                  <div
                    key={notification.id}
                    className={`notification-card ${
                      isUnread
                        ? "notification-unread"
                        : ""
                    }`}
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                  >

                    <div className="notification-icon">
                      {getNotificationIcon(
                        notification
                      )}
                    </div>

                    <div className="notification-content">

                      <div className="notification-top">

                        <h3>
                          {notification.action ||
                            "Notification"}
                        </h3>

                        {isUnread && (
                          <span className="unread-dot" />
                        )}

                      </div>

                      <p>
                        {notification.message ||
                          "You have a new notification."}
                      </p>

                      {notification.timeStamp && (
                        <span className="notification-time">
                          {new Date(
                            notification.timeStamp
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      )}

                    </div>

                    <Link
                      to={notificationLink}
                      className="notification-view-btn"
                      onClick={(event) => {
                        event.stopPropagation();

                        handleNotificationClick(
                          notification
                        );
                      }}
                    >
                      View →
                    </Link>

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

export default Notifications;