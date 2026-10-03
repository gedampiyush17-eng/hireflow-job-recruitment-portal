package com.JobPortalBackend.HireFlowBackend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection="otp")
public class OTP {

    @Id
    private String email;
    private String otpCode;
    private LocalDateTime creationTime;
}
