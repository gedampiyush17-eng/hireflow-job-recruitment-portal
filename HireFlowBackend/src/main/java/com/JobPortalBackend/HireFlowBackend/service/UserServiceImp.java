package com.JobPortalBackend.HireFlowBackend.service;

import com.JobPortalBackend.HireFlowBackend.dto.LoginDTO;
import com.JobPortalBackend.HireFlowBackend.dto.NotificationDTO;
import com.JobPortalBackend.HireFlowBackend.dto.ResponseDTO;
import com.JobPortalBackend.HireFlowBackend.dto.UserDTO;
import com.JobPortalBackend.HireFlowBackend.entity.OTP;
import com.JobPortalBackend.HireFlowBackend.entity.User;
import com.JobPortalBackend.HireFlowBackend.exception.JobPortalException;
import com.JobPortalBackend.HireFlowBackend.repository.UserRepository;
import com.JobPortalBackend.HireFlowBackend.repository.OTPRepository;
import com.JobPortalBackend.HireFlowBackend.utility.Data;
import com.JobPortalBackend.HireFlowBackend.utility.Utilities;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service(value="userService")
@RequiredArgsConstructor
public class UserServiceImp implements UserService{

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final Utilities utilities;
    private final JavaMailSender mailSender;
    private final OTPRepository otpRepository;
    private final ProfileService profileService;
    private final NotificationService notificationService;

    @Override
    public UserDTO registerUser(UserDTO userDTO) throws JobPortalException {

        Optional<User> optional= userRepository.findByEmail(userDTO.getEmail());

        if(optional.isPresent()){
            throw new JobPortalException("User already exists");
        }

        userDTO.setProfileId(
                profileService.createProfile(
                        userDTO.getEmail(),
                        userDTO.getName()
                )
        );

        userDTO.setId(
                utilities.getNextSequence("users")
        );

        userDTO.setPassword(
                passwordEncoder.encode(userDTO.getPassword())
        );

        User user=userDTO.toEntity();

        user=userRepository.save(user);

        return user.toDTO();
    }

    @Override
    public UserDTO getUserByEmail(String email) throws JobPortalException{
        return userRepository.findByEmail(email).
                orElseThrow(()-> new JobPortalException("USER_NOT_FOUND")).toDTO();
    }

    @Override
    public UserDTO loginUser(LoginDTO loginDTO) throws JobPortalException{

        User user=userRepository.findByEmail(loginDTO.getEmail()).
                orElseThrow(()->new JobPortalException("User_Not_Found"));
        if(!passwordEncoder.matches(loginDTO.getPassword(),user.getPassword())) throw new JobPortalException("INVALID_CREDENTIALS");
        return user.toDTO();
    }

    @Override
    public Boolean sendOtp(String email) throws Exception{

        userRepository.findByEmail(email).
                orElseThrow(()->new JobPortalException("USER_NOT_FOUND"));
        MimeMessage mm=mailSender.createMimeMessage();
        MimeMessageHelper message=new MimeMessageHelper(mm,true);
        message.setTo(email);
        message.setFrom("gedampiyush17@gmail.com");
        message.setSubject("Your otp for Password Reset");
        String genOtp=utilities.generateOtp();
        OTP otp=new OTP(email,genOtp, LocalDateTime.now());
        otpRepository.save(otp);
        message.setText(Data.getMessageBody(genOtp),true);
        mailSender.send(mm);
        return true;
    }

    @Override
    public Boolean verifyOtp(String email,String otp) throws JobPortalException{
        OTP otpEntity=otpRepository.findById(email).
                orElseThrow(()->new JobPortalException("OTP_NOT_FOUND"));

        if(!otpEntity.getOtpCode().equals(otp)){
            throw new JobPortalException("Incorrect OTP");
        }
        return true;
    }

    @Override
    public ResponseDTO changePassword(LoginDTO loginDTO) throws JobPortalException{
        User user=userRepository.findByEmail(loginDTO.getEmail()).
            orElseThrow(()->new JobPortalException("USER_NOT_FOUND"));
        user.setPassword(passwordEncoder.encode(loginDTO.getPassword()));
        userRepository.save(user);
        NotificationDTO noti=new NotificationDTO();
        noti.setUserId(user.getId());
        noti.setMessage("Password Reset Successful");
        noti.setAction("Password Reset");
        notificationService.sendNotification(noti);
        return new ResponseDTO("Password change successfully");

    }

    @Scheduled(fixedRate =60000)
    public void removeExpiredOTPs(){
        LocalDateTime expiry = LocalDateTime.now().minusMinutes(5);
        List<OTP> expiredOTPs = otpRepository.findByCreationTimeBefore(expiry);
        if(!expiredOTPs.isEmpty()){
            otpRepository.deleteAll(expiredOTPs);
            System.out.println("Removed "+expiredOTPs.size()+" expired OTPs");
        }
    }




}
