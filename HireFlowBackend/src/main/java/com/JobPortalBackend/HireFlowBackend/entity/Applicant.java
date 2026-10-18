package com.JobPortalBackend.HireFlowBackend.entity;

import com.JobPortalBackend.HireFlowBackend.dto.ApplicantDTO;
import com.JobPortalBackend.HireFlowBackend.dto.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;
import java.util.Base64;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Applicant {
    @Id
    private Long applicantId;
    private String name;
    private String email;
    private Long phone;
    private String website;
    private byte[] resume;
    private String coverLetter;
    private LocalDateTime timeStamp;
    private ApplicationStatus applicationStatus;
    private LocalDateTime interviewTime;

    public ApplicantDTO toDTO(){
        return new ApplicantDTO(
                this.applicantId,
                this.name,
                this.email,
                this.phone,
                this.website,
                this.resume!=null? Base64.getEncoder().encodeToString(this.resume):null,
                this.coverLetter,
                this.timeStamp,
                this.applicationStatus,
                this.interviewTime
        );
    }

}
