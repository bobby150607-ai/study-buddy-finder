package com.studybuddy.controller;

import com.studybuddy.dto.ApiResponse;
import com.studybuddy.dto.CreateGroupRequest;
import com.studybuddy.dto.GroupMemberDTO;
import com.studybuddy.dto.StudyGroupDTO;
import com.studybuddy.entity.User;
import com.studybuddy.exception.ResourceNotFoundException;
import com.studybuddy.repository.UserRepository;
import com.studybuddy.service.StudyGroupService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/groups")
public class StudyGroupController {

    private final StudyGroupService studyGroupService;
    private final UserRepository userRepository;

    public StudyGroupController(StudyGroupService studyGroupService, UserRepository userRepository) {
        this.studyGroupService = studyGroupService;
        this.userRepository = userRepository;
    }

    private Long getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StudyGroupDTO>> createGroup(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateGroupRequest request) {
        Long currentUserId = getUserId(userDetails);
        StudyGroupDTO group = studyGroupService.createGroup(currentUserId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Study group created successfully", group));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<StudyGroupDTO>>> getAllGroups(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String q) {
        Long currentUserId = getUserId(userDetails);
        List<StudyGroupDTO> groups = studyGroupService.getAllGroups(currentUserId, q);
        return ResponseEntity.ok(ApiResponse.success("Study groups", groups));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<StudyGroupDTO>> getGroupById(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long currentUserId = getUserId(userDetails);
        StudyGroupDTO group = studyGroupService.getGroupById(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Study group details", group));
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<ApiResponse<StudyGroupDTO>> joinGroup(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long currentUserId = getUserId(userDetails);
        StudyGroupDTO group = studyGroupService.joinGroup(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Successfully joined the study group", group));
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveGroup(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        Long currentUserId = getUserId(userDetails);
        studyGroupService.leaveGroup(id, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Left study group", null));
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<ApiResponse<List<GroupMemberDTO>>> getGroupMembers(@PathVariable Long id) {
        List<GroupMemberDTO> members = studyGroupService.getGroupMembers(id);
        return ResponseEntity.ok(ApiResponse.success("Group members", members));
    }
}
