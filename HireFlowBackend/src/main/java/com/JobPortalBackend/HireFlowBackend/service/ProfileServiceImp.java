package com.JobPortalBackend.HireFlowBackend.service;

import com.JobPortalBackend.HireFlowBackend.dto.ProfileDTO;
import com.JobPortalBackend.HireFlowBackend.entity.Profile;
import com.JobPortalBackend.HireFlowBackend.exception.JobPortalException;
import com.JobPortalBackend.HireFlowBackend.repository.ProfileRepository;
import com.JobPortalBackend.HireFlowBackend.utility.Utilities;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.batch.BatchProperties;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service("profileService")
@RequiredArgsConstructor
public class ProfileServiceImp implements ProfileService{

    private final ProfileRepository profileRepository;
    private final Utilities utilities;
    public Long createProfile(String email,String name) throws JobPortalException{
        Profile profile=new Profile();
        profile.setId(utilities.getNextSequence("profiles"));
        profile.setEmail(email);
        profile.setName(name);
        profile.setSkills(new ArrayList<>());
        profile.setExperiences(new ArrayList<>());
        profile.setCertifications(new ArrayList<>());
        profileRepository.save(profile);
        return profile.getId();
    }

    @Override
    public ProfileDTO getProfile(Long id) throws JobPortalException{
        return profileRepository.findById(id).
                orElseThrow(()->new JobPortalException("Profile_Not_Found")).toDTO();
    }

    @Override
    public ProfileDTO updateProfile(ProfileDTO profileDTO) throws JobPortalException{
        profileRepository.findById(profileDTO.getId()).
                orElseThrow(()->new JobPortalException("Profile_Not_Found"));
        profileRepository.save(profileDTO.toEntity());
        return profileDTO;
    }

    @Override
    public List<ProfileDTO> getAllProfile() throws JobPortalException{
        return profileRepository.findAll().stream().map((x)->x.toDTO()).toList();
    }

}
