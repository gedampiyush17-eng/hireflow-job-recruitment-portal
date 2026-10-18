import api from "./api";

export const getProfile = async (profileId) => {
  const response = await api.get(`/profiles/get/${profileId}`);
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put("/profiles/update", profileData);
  return response.data;
};