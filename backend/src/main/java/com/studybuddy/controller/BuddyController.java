package com.studybuddy.controller;

import com.studybuddy.dto.ApiResponse;
import com.studybuddy.dto.BuddyRecommendationDTO;
import com.studybuddy.dto.CompatibilityScoreDTO;
import com.studybuddy.entity.Profile;
import com.studybuddy.entity.User;
import com.studybuddy.exception.ResourceNotFoundException;
import com.studybuddy.repository.ProfileRepository;
import com.studybuddy.repository.UserRepository;
import com.studybuddy.service.BuddyMatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/buddies")
public class BuddyController {

    private final BuddyMatchingService buddyMatchingService;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public BuddyController(BuddyMatchingService buddyMatchingService,
                           UserRepository userRepository,
                           ProfileRepository profileRepository) {
        this.buddyMatchingService = buddyMatchingService;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    private Long getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }

    @GetMapping("/recommendations")
    public ResponseEntity<ApiResponse<List<BuddyRecommendationDTO>>> getRecommendations(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String university,
            @RequestParam(required = false) String course,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String q) {
        Long currentUserId = getUserId(userDetails);
        List<BuddyRecommendationDTO> recommendations = buddyMatchingService.getRecommendations(
                currentUserId, subject, university, course, year, q);
        return ResponseEntity.ok(ApiResponse.success("Study buddy recommendations", recommendations));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<BuddyRecommendationDTO>>> searchBuddies(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String university,
            @RequestParam(required = false) String course,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String q) {
        Long currentUserId = getUserId(userDetails);
        List<BuddyRecommendationDTO> results = buddyMatchingService.getRecommendations(
                currentUserId, subject, university, course, year, q);
        return ResponseEntity.ok(ApiResponse.success("Search buddy results", results));
    }

    @GetMapping("/{targetUserId}/compatibility")
    public ResponseEntity<ApiResponse<CompatibilityScoreDTO>> getCompatibility(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long targetUserId) {
        Long currentUserId = getUserId(userDetails);
        Profile currentProfile = profileRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Your profile was not found"));
        Profile targetProfile = profileRepository.findByUserId(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target student profile not found"));

        CompatibilityScoreDTO score = buddyMatchingService.calculateCompatibility(currentProfile, targetProfile);
        return ResponseEntity.ok(ApiResponse.success("Compatibility analysis", score));
    }
}
