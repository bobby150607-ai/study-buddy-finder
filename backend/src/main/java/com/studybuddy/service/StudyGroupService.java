package com.studybuddy.service;

import com.studybuddy.dto.CreateGroupRequest;
import com.studybuddy.dto.GroupMemberDTO;
import com.studybuddy.dto.StudyGroupDTO;
import com.studybuddy.entity.GroupMember;
import com.studybuddy.entity.Profile;
import com.studybuddy.entity.StudyGroup;
import com.studybuddy.entity.Subject;
import com.studybuddy.entity.User;
import com.studybuddy.exception.BadRequestException;
import com.studybuddy.exception.ResourceNotFoundException;
import com.studybuddy.exception.UnauthorizedException;
import com.studybuddy.repository.GroupMemberRepository;
import com.studybuddy.repository.ProfileRepository;
import com.studybuddy.repository.StudyGroupRepository;
import com.studybuddy.repository.SubjectRepository;
import com.studybuddy.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudyGroupService {

    private final StudyGroupRepository studyGroupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final ProfileRepository profileRepository;

    public StudyGroupService(StudyGroupRepository studyGroupRepository,
                             GroupMemberRepository groupMemberRepository,
                             UserRepository userRepository,
                             SubjectRepository subjectRepository,
                             ProfileRepository profileRepository) {
        this.studyGroupRepository = studyGroupRepository;
        this.groupMemberRepository = groupMemberRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.profileRepository = profileRepository;
    }

    public StudyGroupDTO createGroup(Long currentUserId, CreateGroupRequest request) {
        User creator = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserId));

        Subject subject = null;
        if (request.getSubjectId() != null) {
            subject = subjectRepository.findById(request.getSubjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Subject not found: " + request.getSubjectId()));
        }

        StudyGroup group = new StudyGroup(
                request.getName().trim(),
                request.getDescription(),
                subject,
                creator,
                request.getMaxMembers() > 0 ? request.getMaxMembers() : 10
        );

        StudyGroup saved = studyGroupRepository.save(group);

        // Add creator as ADMIN member
        GroupMember adminMember = new GroupMember(saved, creator, "ADMIN");
        groupMemberRepository.save(adminMember);

        return toDTO(saved, currentUserId);
    }

    @Transactional(readOnly = true)
    public List<StudyGroupDTO> getAllGroups(Long currentUserId, String query) {
        List<StudyGroup> groups;
        if (query != null && !query.isBlank()) {
            groups = studyGroupRepository.searchGroups(query.trim());
        } else {
            groups = studyGroupRepository.findAll();
        }

        return groups.stream()
                .map(g -> toDTO(g, currentUserId))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public StudyGroupDTO getGroupById(Long groupId, Long currentUserId) {
        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Study group not found: " + groupId));
        return toDTO(group, currentUserId);
    }

    public StudyGroupDTO joinGroup(Long groupId, Long currentUserId) {
        StudyGroup group = studyGroupRepository.findById(groupId)
                .orElseThrow(() -> new ResourceNotFoundException("Study group not found: " + groupId));

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserId));

        if (groupMemberRepository.existsByStudyGroupIdAndUserId(groupId, currentUserId)) {
            throw new BadRequestException("You are already a member of this study group.");
        }

        int currentCount = groupMemberRepository.countByStudyGroupId(groupId);
        if (currentCount >= group.getMaxMembers()) {
            throw new BadRequestException("This study group is full (max " + group.getMaxMembers() + " members).");
        }

        GroupMember member = new GroupMember(group, user, "MEMBER");
        groupMemberRepository.save(member);

        return toDTO(group, currentUserId);
    }

    public void leaveGroup(Long groupId, Long currentUserId) {
        GroupMember member = groupMemberRepository.findByStudyGroupIdAndUserId(groupId, currentUserId)
                .orElseThrow(() -> new BadRequestException("You are not a member of this study group."));

        StudyGroup group = member.getStudyGroup();
        if (group.getCreator().getId().equals(currentUserId)) {
            // If creator leaves, delete group or transfer
            int totalMembers = groupMemberRepository.countByStudyGroupId(groupId);
            if (totalMembers <= 1) {
                studyGroupRepository.delete(group);
                return;
            }
        }

        groupMemberRepository.delete(member);
    }

    @Transactional(readOnly = true)
    public List<GroupMemberDTO> getGroupMembers(Long groupId) {
        return groupMemberRepository.findByStudyGroupId(groupId).stream()
                .map(this::toMemberDTO)
                .collect(Collectors.toList());
    }

    public boolean isMember(Long groupId, Long userId) {
        return groupMemberRepository.existsByStudyGroupIdAndUserId(groupId, userId);
    }

    public StudyGroupDTO toDTO(StudyGroup group, Long currentUserId) {
        if (group == null) return null;

        StudyGroupDTO dto = new StudyGroupDTO();
        dto.setId(group.getId());
        dto.setName(group.getName());
        dto.setDescription(group.getDescription());
        dto.setMaxMembers(group.getMaxMembers());
        dto.setCreatedAt(group.getCreatedAt());

        if (group.getSubject() != null) {
            dto.setSubjectId(group.getSubject().getId());
            dto.setSubjectCode(group.getSubject().getCode());
            dto.setSubjectName(group.getSubject().getName());
        }

        if (group.getCreator() != null) {
            dto.setCreatorId(group.getCreator().getId());
            dto.setCreatorName(group.getCreator().getName());
        }

        int count = groupMemberRepository.countByStudyGroupId(group.getId());
        dto.setMemberCount(count);

        if (currentUserId != null) {
            dto.setMember(groupMemberRepository.existsByStudyGroupIdAndUserId(group.getId(), currentUserId));
            dto.setCreator(group.getCreator() != null && group.getCreator().getId().equals(currentUserId));
        }

        return dto;
    }

    public GroupMemberDTO toMemberDTO(GroupMember member) {
        GroupMemberDTO dto = new GroupMemberDTO();
        dto.setId(member.getId());
        dto.setRole(member.getRole());
        dto.setJoinedAt(member.getJoinedAt());

        User u = member.getUser();
        if (u != null) {
            dto.setUserId(u.getId());
            dto.setUserName(u.getName());
            dto.setUserEmail(u.getEmail());

            Profile p = profileRepository.findByUserId(u.getId()).orElse(null);
            if (p != null) {
                dto.setUniversity(p.getUniversity());
                dto.setCourse(p.getCourse());
                dto.setAvatarUrl(p.getAvatarUrl());
            }
        }

        return dto;
    }
}
