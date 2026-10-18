package com.JobPortalBackend.HireFlowBackend.dto;

import com.JobPortalBackend.HireFlowBackend.entity.Applicant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Base64;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApplicantDTO {
    private Long applicantId;
    private String name;
    private String email;   // <-- add this
    private Long phone;
    private String website;
    private String resume;
    private String coverLetter;
    private LocalDateTime timeStamp;
    private ApplicationStatus applicationStatus;
    private LocalDateTime interviewTime;

    public Applicant toEntity() {
        return new Applicant(
                this.applicantId,
                this.name,
                this.email,   // <-- pass it to entity
                this.phone,
                this.website,
                this.resume != null ? Base64.getDecoder().decode(this.resume) : null,
                this.coverLetter,
                this.timeStamp,
                this.applicationStatus,
                this.interviewTime
        );
    }
}