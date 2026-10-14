package com.studybuddy.repository;

import com.studybuddy.entity.Profile;
import com.studybuddy.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUser(User user);
    Optional<Profile> findByUserId(Long userId);

    @Query("SELECT p FROM Profile p WHERE p.user.id != :excludeUserId AND p.user.active = true")
    List<Profile> findAllExcludingUser(@Param("excludeUserId") Long excludeUserId);
}
