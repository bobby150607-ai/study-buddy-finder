package com.studybuddy.service;

import com.studybuddy.dto.ProfileDTO;
import com.studybuddy.dto.SubjectDTO;
import com.studybuddy.dto.UpdateProfileRequest;
import com.studybuddy.entity.Profile;
import com.studybuddy.entity.Subject;
import com.studybuddy.entity.User;
import com.studybuddy.exception.ResourceNotFoundException;
import com.studybuddy.repository.ProfileRepository;
import com.studybuddy.repository.SubjectRepository;
import com.studybuddy.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;

    public ProfileService(ProfileRepository profileRepository,
                          UserRepository userRepository,
                          SubjectRepository subjectRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
    }

    @Transactional(readOnly = true)
    public ProfileDTO getProfileByUserId(Long userId) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user id: " + userId));
        return toDTO(profile);
    }

    public ProfileDTO updateProfile(Long userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Profile profile = profileRepository.findByUserId(userId).orElse(null);
        if (profile == null) {
            profile = new Profile();
            profile.setUser(user);
        }

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName().trim());
            userRepository.save(user);
        }

        if (request.getUniversity() != null) profile.setUniversity(request.getUniversity().trim());
        if (request.getCourse() != null) profile.setCourse(request.getCourse().trim());
        if (request.getYearOfStudy() != null) profile.setYearOfStudy(request.getYearOfStudy());
        if (request.getBio() != null) profile.setBio(request.getBio().trim());
        if (request.getAvatarUrl() != null) profile.setAvatarUrl(request.getAvatarUrl().trim());
        if (request.getInterests() != null) profile.setInterests(request.getInterests().trim());
        if (request.getPreferredStudyMethod() != null) profile.setPreferredStudyMethod(request.getPreferredStudyMethod().trim());
        if (request.getAvailableStudyTimes() != null) profile.setAvailableStudyTimes(request.getAvailableStudyTimes().trim());

        Profile saved = profileRepository.save(profile);
        return toDTO(saved);
    }

    public ProfileDTO updateSubjects(Long userId, List<Long> subjectIds) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile not found for user id: " + userId));

        Set<Subject> subjects = new HashSet<>();
        if (subjectIds != null && !subjectIds.isEmpty()) {
            subjects.addAll(subjectRepository.findAllById(subjectIds));
        }

        profile.setSubjects(subjects);
        Profile saved = profileRepository.save(profile);
        return toDTO(saved);
    }

    public ProfileDTO toDTO(Profile profile) {
        if (profile == null) return null;

        ProfileDTO dto = new ProfileDTO();
        dto.setId(profile.getId());

        if (profile.getUser() != null) {
            dto.setUserId(profile.getUser().getId());
            dto.setUserName(profile.getUser().getName());
            dto.setUserEmail(profile.getUser().getEmail());
        }

        dto.setUniversity(profile.getUniversity());
        dto.setCourse(profile.getCourse());
        dto.setYearOfStudy(profile.getYearOfStudy());
        dto.setBio(profile.getBio());
        dto.setAvatarUrl(profile.getAvatarUrl());
        dto.setInterests(profile.getInterests());
        dto.setPreferredStudyMethod(profile.getPreferredStudyMethod());
        dto.setAvailableStudyTimes(profile.getAvailableStudyTimes());
        dto.setUpdatedAt(profile.getUpdatedAt());

        if (profile.getSubjects() != null) {
            List<SubjectDTO> subjectDTOs = profile.getSubjects().stream()
                    .map(s -> new SubjectDTO(s.getId(), s.getCode(), s.getName(), s.getCategory(), s.getDescription()))
                    .sorted(Comparator.comparing(SubjectDTO::getName))
                    .collect(Collectors.toList());
            dto.setSubjects(subjectDTOs);
        } else {
            dto.setSubjects(Collections.emptyList());
        }

        return dto;
    }
}
