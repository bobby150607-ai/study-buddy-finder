package com.studybuddy.service;

import com.studybuddy.dto.GroupMessageDTO;
import com.studybuddy.dto.MessageDTO;
import com.studybuddy.entity.Connection;
import com.studybuddy.entity.ConnectionStatus;
import com.studybuddy.entity.GroupMessage;
import com.studybuddy.entity.Message;
import com.studybuddy.entity.Profile;
import com.studybuddy.entity.StudyGroup;
import com.studybuddy.entity.User;
import com.studybuddy.exception.BadRequestException;
import com.studybuddy.exception.ResourceNotFoundException;
import com.studybuddy.exception.UnauthorizedException;
import com.studybuddy.repository.ConnectionRepository;
import com.studybuddy.repository.GroupMemberRepository;
import com.studybuddy.repository.GroupMessageRepository;
import com.studybuddy.repository.MessageRepository;
import com.studybuddy.repository.ProfileRepository;
import com.studybuddy.repository.StudyGroupRepository;
import com.studybuddy.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final GroupMessageRepository groupMessageRepository;
    private final ConnectionRepository connectionRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;

    public MessageService(MessageRepository messageRepository,
                          GroupMessageRepository groupMessageRepository,
                          ConnectionRepository connectionRepository,
                          StudyGroupRepository studyGroupRepository,
                          GroupMemberRepository groupMemberRepository,
                          UserRepository userRepository,
                          ProfileRepository profileRepository) {
        this.messageRepository = messageRepository;
        this.groupMessageRepository = groupMessageRepository;
        this.connectionRepository = connectionRepository;
        this.studyGroupRepository = studyGroupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
    }

    public MessageDTO sendDirectMessage(Long senderId, Long targetUserId, String content) {
        if (senderId.equals(targetUserId)) {
            throw new BadRequestException("Cannot send message to yourself.");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found: " + senderId));
        User receiver = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found: " + targetUserId));

        // Enforce access control: check connection
        Optional<Connection> connection = connectionRepository.findConnectionBetweenUsers(sender, receiver);
        if (connection.isEmpty() || connection.get().getStatus() != ConnectionStatus.ACCEPTED) {
            throw new UnauthorizedException("You must be connected study buddies to exchange direct messages.");
        }

        Message msg = new Message(sender, receiver, content.trim());
        Message saved = messageRepository.save(msg);

        return toMessageDTO(saved, senderId);
    }

    public List<MessageDTO> getDirectMessages(Long currentUserId, Long targetUserId) {
        User current = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserId));
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Target user not found: " + targetUserId));

        // Enforce connection check
        Optional<Connection> connection = connectionRepository.findConnectionBetweenUsers(current, target);
        if (connection.isEmpty() || connection.get().getStatus() != ConnectionStatus.ACCEPTED) {
            throw new UnauthorizedException("You must be connected study buddies to view this conversation.");
        }

        List<Message> messages = messageRepository.findConversationBetweenUsers(currentUserId, targetUserId);

        // Mark incoming messages as read
        for (Message m : messages) {
            if (m.getReceiver().getId().equals(currentUserId) && !m.isRead()) {
                m.setRead(true);
            }
        }
        messageRepository.saveAll(messages);

        return messages.stream()
                .map(m -> toMessageDTO(m, currentUserId))
                .collect(Collectors.toList());
    }

    public GroupMessageDTO sendGroupMessage(Long groupId, Long senderId, String content) {
        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Study group not found: " + groupId));

        if (!groupMemberRepository.existsByStudyGroupIdAndUserId(groupId, senderId)) {
            throw new UnauthorizedException("You must be a member of this study group to post messages.");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + senderId));

        GroupMessage msg = new GroupMessage(group, sender, content.trim());
        GroupMessage saved = groupMessageRepository.save(msg);

        return toGroupMessageDTO(saved, senderId);
    }

    @Transactional(readOnly = true)
    public List<GroupMessageDTO> getGroupMessages(Long groupId, Long currentUserId) {
        if (!groupMemberRepository.existsByStudyGroupIdAndUserId(groupId, currentUserId)) {
            throw new UnauthorizedException("You must be a member of this study group to view discussions.");
        }

        List<GroupMessage> messages = groupMessageRepository.findByStudyGroupIdOrderBySentAtAsc(groupId);

        return messages.stream()
                .map(m -> toGroupMessageDTO(m, currentUserId))
                .collect(Collectors.toList());
    }

    public MessageDTO toMessageDTO(Message m, Long currentUserId) {
        MessageDTO dto = new MessageDTO();
        dto.setId(m.getId());
        dto.setContent(m.getContent());
        dto.setRead(m.isRead());
        dto.setSentAt(m.getSentAt());

        dto.setSenderId(m.getSender().getId());
        dto.setSenderName(m.getSender().getName());
        Profile senderProfile = profileRepository.findByUserId(m.getSender().getId()).orElse(null);
        if (senderProfile != null) dto.setSenderAvatar(senderProfile.getAvatarUrl());

        dto.setReceiverId(m.getReceiver().getId());
        dto.setReceiverName(m.getReceiver().getName());
        Profile receiverProfile = profileRepository.findByUserId(m.getReceiver().getId()).orElse(null);
        if (receiverProfile != null) dto.setReceiverAvatar(receiverProfile.getAvatarUrl());

        dto.setMe(m.getSender().getId().equals(currentUserId));
        return dto;
    }

    public GroupMessageDTO toGroupMessageDTO(GroupMessage gm, Long currentUserId) {
        GroupMessageDTO dto = new GroupMessageDTO();
        dto.setId(gm.getId());
        dto.setGroupId(gm.getStudyGroup().getId());
        dto.setContent(gm.getContent());
        dto.setSentAt(gm.getSentAt());

        dto.setSenderId(gm.getSender().getId());
        dto.setSenderName(gm.getSender().getName());
        Profile senderProfile = profileRepository.findByUserId(gm.getSender().getId()).orElse(null);
        if (senderProfile != null) dto.setSenderAvatar(senderProfile.getAvatarUrl());

        dto.setMe(gm.getSender().getId().equals(currentUserId));
        return dto;
    }
}
