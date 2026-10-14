package com.studybuddy.controller;

import com.studybuddy.dto.ApiResponse;
import com.studybuddy.dto.GroupMessageDTO;
import com.studybuddy.dto.MessageDTO;
import com.studybuddy.dto.SendMessageRequest;
import com.studybuddy.entity.User;
import com.studybuddy.exception.ResourceNotFoundException;
import com.studybuddy.repository.UserRepository;
import com.studybuddy.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class MessageController {

    private final MessageService messageService;
    private final UserRepository userRepository;

    public MessageController(MessageService messageService, UserRepository userRepository) {
        this.messageService = messageService;
        this.userRepository = userRepository;
    }

    private Long getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }

    @GetMapping("/messages/{targetUserId}")
    public ResponseEntity<ApiResponse<List<MessageDTO>>> getDirectMessages(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long targetUserId) {
        Long currentUserId = getUserId(userDetails);
        List<MessageDTO> messages = messageService.getDirectMessages(currentUserId, targetUserId);
        return ResponseEntity.ok(ApiResponse.success("Direct messages", messages));
    }

    @PostMapping("/messages/{targetUserId}")
    public ResponseEntity<ApiResponse<MessageDTO>> sendDirectMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long targetUserId,
            @Valid @RequestBody SendMessageRequest request) {
        Long currentUserId = getUserId(userDetails);
        MessageDTO message = messageService.sendDirectMessage(currentUserId, targetUserId, request.getContent());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Message sent successfully", message));
    }

    @GetMapping("/groups/{groupId}/messages")
    public ResponseEntity<ApiResponse<List<GroupMessageDTO>>> getGroupMessages(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long groupId) {
        Long currentUserId = getUserId(userDetails);
        List<GroupMessageDTO> messages = messageService.getGroupMessages(groupId, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Group messages", messages));
    }

    @PostMapping("/groups/{groupId}/messages")
    public ResponseEntity<ApiResponse<GroupMessageDTO>> sendGroupMessage(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long groupId,
            @Valid @RequestBody SendMessageRequest request) {
        Long currentUserId = getUserId(userDetails);
        GroupMessageDTO message = messageService.sendGroupMessage(groupId, currentUserId, request.getContent());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Group message sent successfully", message));
    }
}
