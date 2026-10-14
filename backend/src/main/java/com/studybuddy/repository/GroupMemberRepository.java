package com.studybuddy.repository;

import com.studybuddy.entity.GroupMember;
import com.studybuddy.entity.StudyGroup;
import com.studybuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, Long> {
    List<GroupMember> findByStudyGroup(StudyGroup studyGroup);
    List<GroupMember> findByStudyGroupId(Long studyGroupId);
    Optional<GroupMember> findByStudyGroupIdAndUserId(Long studyGroupId, Long userId);
    boolean existsByStudyGroupIdAndUserId(Long studyGroupId, Long userId);
    int countByStudyGroupId(Long studyGroupId);
}
