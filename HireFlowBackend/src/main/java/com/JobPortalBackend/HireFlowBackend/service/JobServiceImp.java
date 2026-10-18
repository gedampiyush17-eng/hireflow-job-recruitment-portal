package com.JobPortalBackend.HireFlowBackend.service;

import com.JobPortalBackend.HireFlowBackend.dto.*;
import com.JobPortalBackend.HireFlowBackend.entity.Applicant;
import com.JobPortalBackend.HireFlowBackend.entity.Job;
import com.JobPortalBackend.HireFlowBackend.exception.JobPortalException;
import com.JobPortalBackend.HireFlowBackend.repository.JobRepository;
import com.JobPortalBackend.HireFlowBackend.utility.Utilities;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service("jobService")
@RequiredArgsConstructor
public class JobServiceImp implements JobService {

    private final JobRepository jobRepository;
    private final Utilities utilities;
    private final NotificationService notificationService;

    @Override
    public JobDTO postJob(
            JobDTO jobDTO
    ) throws JobPortalException {

        if (jobDTO.getId() == null) {

            jobDTO.setId(
                    utilities.getNextSequence("jobs")
            );

            jobDTO.setPostTime(
                    LocalDateTime.now()
            );

        } else {

            Job job = jobRepository.findById(
                    jobDTO.getId()
            ).orElseThrow(
                    () -> new JobPortalException(
                            "JOB_NOT_FOUND"
                    )
            );

            if (
                    job.getJobStatus().equals(
                            JobStatus.DRAFT
                    )
                            ||
                            jobDTO.getJobStatus().equals(
                                    JobStatus.CLOSED
                            )
            ) {

                jobDTO.setPostTime(
                        LocalDateTime.now()
                );
            }
        }

        return jobRepository
                .save(jobDTO.toEntity())
                .toDTO();
    }

    @Override
    public List<JobDTO> getAllJobs()
            throws JobPortalException {

        return jobRepository
                .findAll()
                .stream()
                .map(Job::toDTO)
                .toList();
    }

    @Override
    public JobDTO getJob(
            Long id
    ) throws JobPortalException {

        return jobRepository
                .findById(id)
                .orElseThrow(
                        () -> new JobPortalException(
                                "JOB_NOT_FOUND"
                        )
                )
                .toDTO();
    }

    @Override
    public void applyJob(
            Long id,
            ApplicantDTO applicantDTO
    ) throws JobPortalException {

        Job job = jobRepository
                .findById(id)
                .orElseThrow(
                        () -> new JobPortalException(
                                "JOB_NOT_FOUND"
                        )
                );

        List<Applicant> applicants =
                job.getApplicants();

        if (applicants == null) {
            applicants = new ArrayList<>();
        }

        if (
                applicants.stream()
                        .anyMatch(
                                x -> Objects.equals(
                                        x.getApplicantId(),
                                        applicantDTO.getApplicantId()
                                )
                        )
        ) {

            throw new JobPortalException(
                    "APPLICANT_ALREADY_APPLIED"
            );
        }

        if (
                applicantDTO.getApplicantId() == null
        ) {

            throw new JobPortalException(
                    "APPLICANT_ID_REQUIRED"
            );
        }

        applicantDTO.setApplicationStatus(
                ApplicationStatus.APPLIED
        );

        applicantDTO.setTimeStamp(
                LocalDateTime.now()
        );

        Applicant applicant =
                applicantDTO.toEntity();

        applicant.setApplicantId(
                applicantDTO.getApplicantId()
        );

        applicants.add(applicant);

        job.setApplicants(applicants);

        jobRepository.save(job);
    }

    @Override
    public List<JobDTO> getJobsPostedBy(
            Long id
    ) throws JobPortalException {

        return jobRepository
                .findByPostedBy(id)
                .stream()
                .map(Job::toDTO)
                .toList();
    }

    @Override
    public List<JobDTO> getMyApplications(
            Long applicantId
    ) throws JobPortalException {

        List<Job> jobs =
                jobRepository.findAll();

        List<JobDTO> applications =
                new ArrayList<>();

        for (Job job : jobs) {

            if (job.getApplicants() == null) {
                continue;
            }

            for (
                    Applicant applicant :
                    job.getApplicants()
            ) {

                if (
                        Objects.equals(
                                applicant.getApplicantId(),
                                applicantId
                        )
                ) {

                    JobDTO jobDTO =
                            job.toDTO();

                    List<ApplicantDTO> applicantList =
                            new ArrayList<>();

                    applicantList.add(
                            applicant.toDTO()
                    );

                    jobDTO.setApplicants(
                            applicantList
                    );

                    applications.add(
                            jobDTO
                    );

                    break;
                }
            }
        }

        return applications;
    }

    @Override
    public void changeAppStatus(
            Application application
    ) throws JobPortalException {

        Job job = jobRepository.findById(
                application.getId()
        ).orElseThrow(
                () -> new JobPortalException(
                        "APPLICATION_NOT_FOUND"
                )
        );

        if (job.getApplicants() == null) {

            throw new JobPortalException(
                    "APPLICANT_NOT_FOUND"
            );
        }

        for (
                Applicant applicant :
                job.getApplicants()
        ) {

            if (
                    Objects.equals(
                            application.getApplicantId(),
                            applicant.getApplicantId()
                    )
            ) {

                applicant.setApplicationStatus(
                        application.getApplicationStatus()
                );

                if (
                        application.getApplicationStatus()
                                == ApplicationStatus.INTERVIEWING
                ) {

                    applicant.setInterviewTime(
                            application.getInterviewTime()
                    );

                    NotificationDTO notification =
                            new NotificationDTO();

                    notification.setUserId(
                            applicant.getApplicantId()
                    );

                    notification.setAction(
                            "Interview Scheduled"
                    );

                    notification.setMessage(
                            "Your application for "
                                    + job.getJobTitle()
                                    + " has been moved to the interview stage."
                    );

                    notification.setRoute(
                            "/applications"
                    );

                    notification.setStatus(
                            NotificationStatus.UNREAD
                    );

                    notification.setTimeStamp(
                            LocalDateTime.now()
                    );

                    notificationService.sendNotification(
                            notification
                    );
                }

                else if (
                        application.getApplicationStatus()
                                == ApplicationStatus.REJECTED
                ) {

                    NotificationDTO notification =
                            new NotificationDTO();

                    notification.setUserId(
                            applicant.getApplicantId()
                    );

                    notification.setAction(
                            "Application Rejected"
                    );

                    notification.setMessage(
                            "Your application for "
                                    + job.getJobTitle()
                                    + " has been rejected."
                    );

                    notification.setRoute(
                            "/applications"
                    );

                    notification.setStatus(
                            NotificationStatus.UNREAD
                    );

                    notification.setTimeStamp(
                            LocalDateTime.now()
                    );

                    notificationService.sendNotification(
                            notification
                    );
                }

                else if (
                        application.getApplicationStatus()
                                == ApplicationStatus.OFFERED
                ) {

                    NotificationDTO notification =
                            new NotificationDTO();

                    notification.setUserId(
                            applicant.getApplicantId()
                    );

                    notification.setAction(
                            "Job Offer"
                    );

                    notification.setMessage(
                            "Congratulations! You have received an offer for "
                                    + job.getJobTitle()
                                    + "."
                    );

                    notification.setRoute(
                            "/applications"
                    );

                    notification.setStatus(
                            NotificationStatus.UNREAD
                    );

                    notification.setTimeStamp(
                            LocalDateTime.now()
                    );

                    notificationService.sendNotification(
                            notification
                    );
                }

                break;
            }
        }

        jobRepository.save(job);
    }
}