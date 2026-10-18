import api from "./api";

export const loginUser = async (
  email,
  password
) => {
  const response = await api.post(
    "/users/login",
    {
      email,
      password,
    }
  );

  return response.data;
};

export const registerUser = async (
  userData
) => {
  const response = await api.post(
    "/users/register",
    userData
  );

  return response.data;
};

export const sendOtp = async (
  email
) => {
  const response = await api.post(
    `/users/sendOtp/${email}`
  );

  return response.data;
};

export const verifyOtp = async (
  email,
  otp
) => {
  const response = await api.get(
    `/users/verifyOtp/${email}/${otp}`
  );

  return response.data;
};

export const changePassword = async (
  email,
  password
) => {
  const response = await api.post(
    "/users/changePass",
    {
      email,
      password,
    }
  );

  return response.data;
};