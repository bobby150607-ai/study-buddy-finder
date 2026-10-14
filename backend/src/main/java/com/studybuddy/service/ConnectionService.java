
package com.studybuddy.service;

import com.studybuddy.dto.ConnectionDTO;
import com.studybuddy.dto.ProfileDTO;
import com.studybuddy.dto.UserDTO;
import com.studybuddy.entity.Connection;
import com.studybuddy.entity.ConnectionStatus;
import com.studybuddy.entity.Profile;
import com.studybuddy.entity.User;
import com.studybuddy.exception.BadRequestException;
import com.studybuddy.exception.ResourceNotFoundException;
import com.studybuddy.exception.UnauthorizedException;
import com.studybuddy.repository.ConnectionRepository;
import com.studybuddy.repository.ProfileRepository;
import com.studybuddy.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ConnectionService {

    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final ProfileService profileService;

    public ConnectionService(ConnectionRepository connectionRepository,
                             UserRepository userRepository,
                             ProfileRepository profileRepository,
                             ProfileService profileService) {
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.profileService = profileService;
    }

    public ConnectionDTO sendConnectionRequest(Long currentUserId, Long targetUserId) {
        if (currentUserId.equals(targetUserId)) {
            throw new BadRequestException(
                    "You cannot send a connection request to yourself.");
        }

        User requester = userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("User not found: " + currentUserId));

        User receiver = userRepository.findById(targetUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Target user not found: " + targetUserId));

        if (!receiver.isActive()) {
            throw new BadRequestException(
                    "Cannot connect with an inactive account.");
        }

        Optional<Connection> existing =
                connectionRepository.findConnectionBetweenUsers(requester, receiver);

        Connection connection;

        if (existing.isPresent()) {
            connection = existing.get();

            if (connection.getStatus() == ConnectionStatus.ACCEPTED) {
                throw new BadRequestException(
                        "You are already connected with this student.");
            }

            if (connection.getStatus() == ConnectionStatus.PENDING) {
                if (connection.getRequester().getId().equals(currentUserId)) {
                    throw new BadRequestException(
                            "A connection request is already pending.");
                } else {
                    connection.setStatus(ConnectionStatus.ACCEPTED);
                    connection.setUpdatedAt(LocalDateTime.now());
                    return toDTO(
                            connectionRepository.save(connection), currentUserId);
                }
            }

            // Reuse rejected or cancelled records.
            connection.setRequester(requester);
            connection.setReceiver(receiver);
            connection.setStatus(ConnectionStatus.PENDING);
            connection.setUpdatedAt(LocalDateTime.now());
        } else {
            connection = new Connection(
                    requester, receiver, ConnectionStatus.PENDING);
        }

        Connection saved = connectionRepository.save(connection);
        return toDTO(saved, currentUserId);
    }

    @Transactional(readOnly = true)
    public List<ConnectionDTO> getAcceptedConnections(Long currentUserId) {
        return connectionRepository.findAcceptedConnectionsByUserId(currentUserId)
                .stream()
                .map(c -> toDTO(c, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Map<String, List<ConnectionDTO>> getPendingRequests(Long currentUserId) {
        List<ConnectionDTO> incoming =
                connectionRepository.findIncomingPendingRequests(currentUserId)
                        .stream()
                        .map(c -> toDTO(c, currentUserId))
                        .collect(Collectors.toList());

        List<ConnectionDTO> outgoing =
                connectionRepository.findOutgoingPendingRequests(currentUserId)
                        .stream()
                        .map(c -> toDTO(c, currentUserId))
                        .collect(Collectors.toList());

        Map<String, List<ConnectionDTO>> result = new HashMap<>();
        result.put("incoming", incoming);
        result.put("outgoing", outgoing);

        return result;
    }

    public ConnectionDTO acceptRequest(Long connectionId, Long currentUserId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Connection request not found: " + connectionId));

        if (!connection.getReceiver().getId().equals(currentUserId)) {
            throw new UnauthorizedException(
                    "You are not authorized to accept this connection request.");
        }

        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new BadRequestException(
                    "Connection request is not pending.");
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);
        connection.setUpdatedAt(LocalDateTime.now());

        return toDTO(connectionRepository.save(connection), currentUserId);
    }

    public ConnectionDTO rejectRequest(Long connectionId, Long currentUserId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Connection request not found: " + connectionId));

        if (!connection.getReceiver().getId().equals(currentUserId)) {
            throw new UnauthorizedException(
                    "You are not authorized to reject this connection request.");
        }

        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new BadRequestException(
                    "Connection request is not pending.");
        }

        connection.setStatus(ConnectionStatus.REJECTED);
        connection.setUpdatedAt(LocalDateTime.now());

        return toDTO(connectionRepository.save(connection), currentUserId);
    }

    public void cancelOrRemoveConnection(Long connectionId, Long currentUserId) {
        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Connection not found: " + connectionId));

        if (!connection.getRequester().getId().equals(currentUserId)
                && !connection.getReceiver().getId().equals(currentUserId)) {
            throw new UnauthorizedException(
                    "You are not authorized to modify this connection.");
        }

        connectionRepository.delete(connection);
    }

    /**
     * Testing helper: simulates acceptance of an outgoing request.
     */
    public ConnectionDTO acceptAsReceiverDemo(
            Long connectionId, Long currentUserId) {

        Connection connection = connectionRepository.findById(connectionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Connection not found: " + connectionId));

        if (connection.getStatus() != ConnectionStatus.PENDING) {
            throw new BadRequestException(
                    "Connection is not in PENDING state.");
        }

        if (!connection.getRequester().getId().equals(currentUserId)
                && !connection.getReceiver().getId().equals(currentUserId)) {
            throw new UnauthorizedException(
                    "Not authorized for this connection.");
        }

        connection.setStatus(ConnectionStatus.ACCEPTED);
        connection.setUpdatedAt(LocalDateTime.now());

        return toDTO(connectionRepository.save(connection), currentUserId);
    }

    /**
     * Testing helper: creates an incoming request only when no connection
     * record already exists between the selected classmate and current user.
     */
    public ConnectionDTO simulateIncomingRequest(Long currentUserId) {
        User receiver = userRepository.findById(currentUserId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Current user not found"));

        List<User> potentialSenders = userRepository.findAll()
                .stream()
                .filter(u -> !u.getId().equals(currentUserId) && u.isActive())
                .collect(Collectors.toList());

        if (potentialSenders.isEmpty()) {
            throw new BadRequestException(
                    "No potential classmates found to send test request.");
        }

        for (User candidate : potentialSenders) {
            Optional<Connection> existing =
                    connectionRepository.findConnectionBetweenUsers(
                            candidate, receiver);

            if (existing.isEmpty()) {
                Connection newConnection = new Connection(
                        candidate, receiver, ConnectionStatus.PENDING);

                return toDTO(
                        connectionRepository.save(newConnection), currentUserId);
            }
        }

        throw new BadRequestException(
                "All active classmates already have connection records. "
                + "Use an existing invitation or another test account.");
    }

    public ConnectionDTO toDTO(Connection connection, Long currentUserId) {
        if (connection == null) {
            return null;
        }

        ConnectionDTO dto = new ConnectionDTO();
        dto.setId(connection.getId());
        dto.setStatus(connection.getStatus().name());
        dto.setCreatedAt(connection.getCreatedAt());
        dto.setUpdatedAt(connection.getUpdatedAt());

        User requester = connection.getRequester();
        User receiver = connection.getReceiver();

        dto.setRequesterId(requester.getId());
        dto.setRequesterName(requester.getName());
        dto.setRequesterEmail(requester.getEmail());

        dto.setReceiverId(receiver.getId());
        dto.setReceiverName(receiver.getName());
        dto.setReceiverEmail(receiver.getEmail());

        Profile requesterProfile =
                profileRepository.findByUserId(requester.getId()).orElse(null);

        if (requesterProfile != null) {
            dto.setRequesterUniversity(requesterProfile.getUniversity());
            dto.setRequesterCourse(requesterProfile.getCourse());
            dto.setRequesterAvatar(requesterProfile.getAvatarUrl());
        }

        Profile receiverProfile =
                profileRepository.findByUserId(receiver.getId()).orElse(null);

        if (receiverProfile != null) {
            dto.setReceiverUniversity(receiverProfile.getUniversity());
            dto.setReceiverCourse(receiverProfile.getCourse());
            dto.setReceiverAvatar(receiverProfile.getAvatarUrl());
        }

        boolean isIncoming = receiver.getId().equals(currentUserId);
        dto.setIncoming(isIncoming);

        User otherUser = isIncoming ? requester : receiver;
        Profile otherProfile = isIncoming ? requesterProfile : receiverProfile;

        dto.setOtherUser(new UserDTO(
                otherUser.getId(),
                otherUser.getEmail(),
                otherUser.getName(),
                otherUser.getRole(),
                otherUser.isActive()));

        dto.setOtherProfile(profileService.toDTO(otherProfile));

        return dto;
    }
}
