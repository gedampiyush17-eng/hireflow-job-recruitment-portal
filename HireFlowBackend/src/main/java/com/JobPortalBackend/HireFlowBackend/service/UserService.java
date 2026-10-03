package com.JobPortalBackend.HireFlowBackend.service;

import com.JobPortalBackend.HireFlowBackend.dto.LoginDTO;
import com.JobPortalBackend.HireFlowBackend.dto.ResponseDTO;
import com.JobPortalBackend.HireFlowBackend.dto.UserDTO;
import com.JobPortalBackend.HireFlowBackend.exception.JobPortalException;

public interface UserService {

    public UserDTO registerUser(UserDTO userDTO) throws JobPortalException;

    public UserDTO getUserByEmail(String email) throws JobPortalException;

    public UserDTO loginUser(LoginDTO loginDTO) throws JobPortalException;

    public Boolean sendOtp(String email) throws Exception;

    public Boolean verifyOtp(String email, String otp) throws JobPortalException;

    public ResponseDTO changePassword(LoginDTO loginDTO) throws JobPortalException;

}
