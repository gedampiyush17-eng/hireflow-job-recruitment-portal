package com.JobPortalBackend.HireFlowBackend.controller;

import com.JobPortalBackend.HireFlowBackend.Jwt.AuthenticationResponse;
import com.JobPortalBackend.HireFlowBackend.Jwt.JwtHelper;
import com.JobPortalBackend.HireFlowBackend.Jwt.MyUserDetailsService;
import com.JobPortalBackend.HireFlowBackend.dto.LoginDTO;
import com.JobPortalBackend.HireFlowBackend.dto.ResponseDTO;
import com.JobPortalBackend.HireFlowBackend.dto.UserDTO;
import com.JobPortalBackend.HireFlowBackend.exception.JobPortalException;
import com.JobPortalBackend.HireFlowBackend.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@Validated
@CrossOrigin
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final MyUserDetailsService myUserDetailsService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> registerUser(@RequestBody @Valid UserDTO userDTO)throws JobPortalException{
        userDTO=userService.registerUser(userDTO);
        return new ResponseEntity<>(userDTO, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> loginUser(@RequestBody @Valid LoginDTO loginDTO )throws JobPortalException{
        userService.loginUser(loginDTO);

        UserDetails userDetails=myUserDetailsService.loadUserByUsername(loginDTO.getEmail());

        String token= JwtHelper.generateToken(userDetails);
        return new ResponseEntity<>(new AuthenticationResponse(token),HttpStatus.OK);
    }

    @PostMapping("/sendOtp/{email}")
    public ResponseEntity<ResponseDTO> sendOtp(@PathVariable @Email(message = "{user.email.invalid}")String email) throws Exception{
        userService.sendOtp(email);
        return new ResponseEntity<>(new ResponseDTO("OTP verified"),HttpStatus.OK);
    }

    @GetMapping("/verifyOtp/{email}/{otp}")
    public ResponseEntity<ResponseDTO> verifyOtp(@PathVariable @Email(message = "{user.email.invalid}")String email, @PathVariable @Pattern(regexp="^[0-9]{6}$",message="{otp.invalid}")String otp) throws JobPortalException{
        userService.verifyOtp(email,otp);
        return new ResponseEntity<>(new ResponseDTO("OTP verified"),HttpStatus.OK);
    }

    @PostMapping("/changePass")
    public ResponseEntity<ResponseDTO> changePassword(@RequestBody @Valid LoginDTO loginDTO)throws JobPortalException{
        return new ResponseEntity<>(userService.changePassword(loginDTO),HttpStatus.OK);
    }
}
