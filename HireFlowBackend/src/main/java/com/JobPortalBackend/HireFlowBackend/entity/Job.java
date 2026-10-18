package com.JobPortalBackend.HireFlowBackend.entity;

import com.JobPortalBackend.HireFlowBackend.dto.JobDTO;
import com.JobPortalBackend.HireFlowBackend.dto.JobStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "jobs")
public class Job {
    @Id
    private Long id;
    private  String jobTitle;
    private String company;
    private List<Applicant> applicants;
    private String about;
    private String experience;
    private String jobType;
    private String location;
    private Long packageOffered;
    private LocalDateTime postTime;
    private String description;
    private List<String> skillRequired;
    private JobStatus jobStatus;
    private Long postedBy;

    public JobDTO toDTO() {
        return new JobDTO(
                this.id,
                this.jobTitle,
                this.company,
                this.applicants != null
                        ? this.applicants.stream().map(x -> x.toDTO()).toList()
                        : null,
                this.about,
                this.experience,
                this.jobType,
                this.location,
                this.packageOffered,
                this.postTime,
                this.description,
                this.skillRequired,
                this.jobStatus,
                this.postedBy
        );
    }

}
