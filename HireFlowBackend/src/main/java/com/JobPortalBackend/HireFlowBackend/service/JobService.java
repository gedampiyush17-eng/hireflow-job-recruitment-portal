package com.JobPortalBackend.HireFlowBackend.service;

import com.JobPortalBackend.HireFlowBackend.dto.ApplicantDTO;
import com.JobPortalBackend.HireFlowBackend.dto.Application;
import com.JobPortalBackend.HireFlowBackend.dto.JobDTO;
import com.JobPortalBackend.HireFlowBackend.exception.JobPortalException;

import java.util.List;

public interface JobService {

    public JobDTO postJob(
            JobDTO jobDTO
    ) throws JobPortalException;

    public List<JobDTO> getAllJobs()
            throws JobPortalException;

    public JobDTO getJob(
            Long id
    ) throws JobPortalException;

    public void applyJob(
            Long id,
            ApplicantDTO applicantDTO
    ) throws JobPortalException;

    public List<JobDTO> getJobsPostedBy(
            Long id
    ) throws JobPortalException;

    public List<JobDTO> getMyApplications(
            Long applicantId
    ) throws JobPortalException;

    public void changeAppStatus(
            Application application
    ) throws JobPortalException;
}