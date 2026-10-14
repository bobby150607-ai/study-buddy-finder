package com.studybuddy.controller;

import com.studybuddy.dto.ApiResponse;
import com.studybuddy.dto.ProfileDTO;
import com.studybuddy.dto.UpdateProfileRequest;
import com.studybuddy.dto.UpdateSubjectsRequest;
import com.studybuddy.entity.User;
import com.studybuddy.exception.ResourceNotFoundException;
import com.studybuddy.repository.UserRepository;
import com.studybuddy.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private final ProfileService profileService;
    private final UserRepository userRepository;

    public ProfileController(ProfileService profileService, UserRepository userRepository) {
        this.profileService = profileService;
        this.userRepository = userRepository;
    }

    private Long getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileDTO>> getMyProfile(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = getUserId(userDetails);
        ProfileDTO profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("User profile", profile));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ProfileDTO>> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {
        Long userId = getUserId(userDetails);
        ProfileDTO profile = profileService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", profile));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<ProfileDTO>> getProfileById(@PathVariable Long userId) {
        ProfileDTO profile = profileService.getProfileByUserId(userId);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
    }

    @PutMapping("/me/subjects")
    public ResponseEntity<ApiResponse<ProfileDTO>> updateMySubjects(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateSubjectsRequest request) {
        Long userId = getUserId(userDetails);
        ProfileDTO profile = profileService.updateSubjects(userId, request.getSubjectIds());
        return ResponseEntity.ok(ApiResponse.success("Subjects updated successfully", profile));
    }
}
