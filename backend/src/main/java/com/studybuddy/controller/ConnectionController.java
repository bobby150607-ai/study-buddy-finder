package com.studybuddy.controller;

import com.studybuddy.dto.ApiResponse;
import com.studybuddy.dto.ConnectionDTO;
import com.studybuddy.entity.User;
import com.studybuddy.exception.ResourceNotFoundException;
import com.studybuddy.repository.UserRepository;
import com.studybuddy.service.ConnectionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/connections")
public class ConnectionController {

    private final ConnectionService connectionService;
    private final UserRepository userRepository;

    public ConnectionController(ConnectionService connectionService, UserRepository userRepository) {
        this.connectionService = connectionService;
        this.userRepository = userRepository;
    }

    private Long getUserId(UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return user.getId();
    }

    @PostMapping("/{targetUserId}")
    public ResponseEntity<ApiResponse<ConnectionDTO>> sendConnectionRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long targetUserId) {
        Long currentUserId = getUserId(userDetails);
        ConnectionDTO connection = connectionService.sendConnectionRequest(currentUserId, targetUserId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Connection request processed", connection));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ConnectionDTO>>> getConnections(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long currentUserId = getUserId(userDetails);
        List<ConnectionDTO> connections = connectionService.getAcceptedConnections(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Connected study buddies", connections));
    }

    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<Map<String, List<ConnectionDTO>>>> getPendingRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long currentUserId = getUserId(userDetails);
        Map<String, List<ConnectionDTO>> requests = connectionService.getPendingRequests(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Pending connection requests", requests));
    }

    @PutMapping("/{connectionId}/accept")
    public ResponseEntity<ApiResponse<ConnectionDTO>> acceptRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long connectionId) {
        Long currentUserId = getUserId(userDetails);
        ConnectionDTO connection = connectionService.acceptRequest(connectionId, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Connection request accepted", connection));
    }

    @PutMapping("/{connectionId}/reject")
    public ResponseEntity<ApiResponse<ConnectionDTO>> rejectRequest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long connectionId) {
        Long currentUserId = getUserId(userDetails);
        ConnectionDTO connection = connectionService.rejectRequest(connectionId, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Connection request rejected", connection));
    }

    @DeleteMapping("/{connectionId}")
    public ResponseEntity<ApiResponse<Void>> removeConnection(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long connectionId) {
        Long currentUserId = getUserId(userDetails);
        connectionService.cancelOrRemoveConnection(connectionId, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Connection updated/removed", null));
    }

    @PostMapping("/{connectionId}/demo-accept")
    public ResponseEntity<ApiResponse<ConnectionDTO>> demoAccept(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long connectionId) {
        Long currentUserId = getUserId(userDetails);
        ConnectionDTO connection = connectionService.acceptAsReceiverDemo(connectionId, currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Invitation accepted via test helper", connection));
    }

    @PostMapping("/simulate-incoming")
    public ResponseEntity<ApiResponse<ConnectionDTO>> simulateIncoming(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long currentUserId = getUserId(userDetails);
        ConnectionDTO connection = connectionService.simulateIncomingRequest(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("Test invitation received", connection));
    }
}
