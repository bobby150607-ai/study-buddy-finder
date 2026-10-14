package com.studybuddy.service;

import com.studybuddy.dto.ConnectionDTO;
import com.studybuddy.entity.Connection;
import com.studybuddy.entity.ConnectionStatus;
import com.studybuddy.entity.Profile;
import com.studybuddy.entity.User;
import com.studybuddy.exception.BadRequestException;
import com.studybuddy.repository.ConnectionRepository;
import com.studybuddy.repository.ProfileRepository;
import com.studybuddy.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ConnectionServiceTest {

    @Mock
    private ConnectionRepository connectionRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProfileRepository profileRepository;

    @Mock
    private ProfileService profileService;

    @InjectMocks
    private ConnectionService connectionService;

    private User user1;
    private User user2;

    @BeforeEach
    public void setUp() {
        user1 = new User("user1@univ.edu", "pass", "User One");
        user1.setId(1L);

        user2 = new User("user2@univ.edu", "pass", "User Two");
        user2.setId(2L);
    }

    @Test
    public void testSelfConnectionThrowsBadRequestException() {
        assertThrows(BadRequestException.class, () -> {
            connectionService.sendConnectionRequest(1L, 1L);
        }, "Cannot connect with oneself");
    }

    @Test
    public void testSendConnectionRequestSuccess() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));
        when(connectionRepository.findConnectionBetweenUsers(user1, user2)).thenReturn(Optional.empty());

        Connection savedConn = new Connection(user1, user2, ConnectionStatus.PENDING);
        savedConn.setId(10L);
        when(connectionRepository.save(any(Connection.class))).thenReturn(savedConn);
        when(profileRepository.findByUserId(anyLong())).thenReturn(Optional.of(new Profile()));

        ConnectionDTO dto = connectionService.sendConnectionRequest(1L, 2L);

        assertNotNull(dto);
        assertEquals("PENDING", dto.getStatus());
        assertEquals(1L, dto.getRequesterId());
        assertEquals(2L, dto.getReceiverId());
        verify(connectionRepository, times(1)).save(any(Connection.class));
    }

    @Test
    public void testDuplicatePendingRequestThrowsException() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user1));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user2));

        Connection existingConn = new Connection(user1, user2, ConnectionStatus.PENDING);
        when(connectionRepository.findConnectionBetweenUsers(user1, user2)).thenReturn(Optional.of(existingConn));

        assertThrows(BadRequestException.class, () -> {
            connectionService.sendConnectionRequest(1L, 2L);
        }, "Duplicate pending request should fail");
    }
}
