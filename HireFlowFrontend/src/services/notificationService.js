import api from "./api";

export const getNotifications = async (userId) => {
  const response = await api.get(
    `/notification/get/${userId}`
  );

  return response.data;
};

export const markNotificationAsRead = async (
  notificationId
) => {
  const response = await api.put(
    `/notification/read/${notificationId}`
  );

  return response.data;
};