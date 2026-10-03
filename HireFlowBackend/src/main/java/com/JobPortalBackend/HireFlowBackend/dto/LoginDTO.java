package com.JobPortalBackend.HireFlowBackend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Data
@NoArgsConstructor
@RequiredArgsConstructor
public class LoginDTO {

    private String email;
    private String password;
}
