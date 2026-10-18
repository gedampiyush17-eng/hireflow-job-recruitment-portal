import api from "./api";

export const getAllJobs = async () => {
  const response = await api.get(
    "/jobs/getAll"
  );

  return response.data;
};

export const getJobById = async (id) => {
  const response = await api.get(
    `/jobs/get/${id}`
  );

  return response.data;
};

export const applyForJob = async (
  jobId,
  applicantData
) => {
  const response = await api.post(
    `/jobs/apply/${jobId}`,
    applicantData
  );

  return response.data;
};

export const getPostedJobs = async (
  userId
) => {
  const response = await api.get(
    `/jobs/postedBy/${userId}`
  );

  return response.data;
};

export const postJob = async (
  jobData
) => {
  const response = await api.post(
    "/jobs/post",
    jobData
  );

  return response.data;
};

export const changeApplicationStatus =
  async (applicationData) => {
    const response = await api.post(
      "/jobs/changeAppStatus",
      applicationData
    );

    return response.data;
  };

export const getMyApplications = async (
  applicantId
) => {
  const response = await api.get(
    `/jobs/applications/${applicantId}`
  );

  const jobs = response.data || [];

  const applications = [];

  jobs.forEach((job) => {
    const applicant =
      job.applicants?.find(
        (item) =>
          Number(item.applicantId) ===
          Number(applicantId)
      );

    if (applicant) {
      applications.push({
        job,
        application: applicant,
      });
    }
  });

  return applications;
};