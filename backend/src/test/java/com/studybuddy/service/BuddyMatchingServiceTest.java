package com.studybuddy.service;

import com.studybuddy.dto.CompatibilityScoreDTO;
import com.studybuddy.entity.Profile;
import com.studybuddy.entity.Subject;
import com.studybuddy.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class BuddyMatchingServiceTest {

    @InjectMocks
    private BuddyMatchingService buddyMatchingService;

    private Profile profile1;
    private Profile profile2;
    private Subject cs101;
    private Subject cs202;
    private Subject math201;

    @BeforeEach
    public void setUp() {
        User user1 = new User("user1@univ.edu", "pass", "User One");
        user1.setId(1L);
        profile1 = new Profile(user1, "Stanford", "CS", 3);

        User user2 = new User("user2@univ.edu", "pass", "User Two");
        user2.setId(2L);
        profile2 = new Profile(user2, "Stanford", "CS", 3);

        cs101 = new Subject("CS101", "Algorithms", "CS", "Algorithms course");
        cs101.setId(1L);
        cs202 = new Subject("CS202", "Databases", "CS", "Databases course");
        cs202.setId(2L);
        math201 = new Subject("MATH201", "Linear Algebra", "Math", "Linear Algebra");
        math201.setId(3L);
    }

    @Test
    public void testHighCompatibilityCalculation() {
        // Both take CS101, CS202, MATH201
        profile1.setSubjects(new HashSet<>(List.of(cs101, cs202, math201)));
        profile2.setSubjects(new HashSet<>(List.of(cs101, cs202, math201)));

        // Shared interests
        profile1.setInterests("Machine Learning, Competitive Programming, Web Dev");
        profile2.setInterests("Machine Learning, Competitive Programming, Open Source");

        // Matching study preference
        profile1.setPreferredStudyMethod("Hybrid");
        profile2.setPreferredStudyMethod("Hybrid");

        // Matching availability
        profile1.setAvailableStudyTimes("Weekday Evenings, Weekend Mornings");
        profile2.setAvailableStudyTimes("Weekday Evenings, Weekend Mornings");

        CompatibilityScoreDTO score = buddyMatchingService.calculateCompatibility(profile1, profile2);

        assertNotNull(score);
        assertEquals(50.0, score.getSubjectsScore(), 0.1, "Subjects score should be maximum 50%");
        assertEquals(15.0, score.getPreferenceScore(), 0.1, "Study preference should match exactly 15%");
        assertEquals(15.0, score.getAvailabilityScore(), 0.1, "Availability should match 15%");
        assertTrue(score.getOverallScore() >= 90, "Overall score should be very high (>=90%)");
        assertTrue(score.getCommonSubjects().contains("Algorithms"));
        assertTrue(score.getExplanation().contains("% Match:"));
    }

    @Test
    public void testZeroOverlapCalculation() {
        Subject lit100 = new Subject("LIT100", "Literature", "Arts", "World Literature");
        lit100.setId(4L);

        profile1.setSubjects(new HashSet<>(List.of(cs101)));
        profile2.setSubjects(new HashSet<>(List.of(lit100)));

        profile1.setInterests("Robotics");
        profile2.setInterests("Poetry");

        profile1.setPreferredStudyMethod("Online / Video Call");
        profile2.setPreferredStudyMethod("Silent Solo");

        profile1.setAvailableStudyTimes("Weekday Mornings");
        profile2.setAvailableStudyTimes("Weekend Nights");

        CompatibilityScoreDTO score = buddyMatchingService.calculateCompatibility(profile1, profile2);

        assertNotNull(score);
        assertEquals(0.0, score.getSubjectsScore(), 0.1);
        assertEquals(0.0, score.getInterestsScore(), 0.1);
        assertTrue(score.getOverallScore() < 25, "Score should be low for disparate profiles");
    }

    @Test
    public void testNullProfileHandling() {
        CompatibilityScoreDTO score = buddyMatchingService.calculateCompatibility(null, profile2);
        assertNotNull(score);
        assertEquals(0, score.getOverallScore());
        assertEquals("Insufficient profile data for matching calculation.", score.getExplanation());
    }
}
