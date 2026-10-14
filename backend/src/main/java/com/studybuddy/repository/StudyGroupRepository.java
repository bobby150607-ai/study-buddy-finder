package com.studybuddy.repository;

import com.studybuddy.entity.StudyGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyGroupRepository extends JpaRepository<StudyGroup, Long> {

    List<StudyGroup> findBySubjectId(Long subjectId);

    @Query("SELECT g FROM StudyGroup g WHERE LOWER(g.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(g.description) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<StudyGroup> searchGroups(@Param("query") String query);

    @Query("SELECT g FROM StudyGroup g JOIN g.members m WHERE m.user.id = :userId")
    List<StudyGroup> findGroupsByUserId(@Param("userId") Long userId);
}
