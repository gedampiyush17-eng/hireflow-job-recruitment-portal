package com.JobPortalBackend.HireFlowBackend.Jwt;

import com.JobPortalBackend.HireFlowBackend.dto.UserDTO;
import com.JobPortalBackend.HireFlowBackend.exception.JobPortalException;
import com.JobPortalBackend.HireFlowBackend.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException{
        try {
            UserDTO dto = userService.getUserByEmail(email);
            return new CustomUserDetails(
                    dto.getId(),
                    dto.getEmail(),
                    dto.getName(),
                    dto.getPassword(),
                    dto.getProfileId(),
                    dto.getAccountType(),
                    new ArrayList<>()
            );
        }catch(JobPortalException e){
                throw new RuntimeException(e);
        }

    }
}
