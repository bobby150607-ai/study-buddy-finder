package com.studybuddy.service;

import com.studybuddy.dto.BuddyRecommendationDTO;
import com.studybuddy.dto.CompatibilityScoreDTO;
import com.studybuddy.dto.ProfileDTO;
import com.studybuddy.dto.UserDTO;
import com.studybuddy.entity.Connection;
import com.studybuddy.entity.ConnectionStatus;
import com.studybuddy.entity.Profile;
import com.studybuddy.entity.Subject;
import com.studybuddy.entity.User;
import com.studybuddy.repository.ConnectionRepository;
import com.studybuddy.repository.ProfileRepository;
import com.studybuddy.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class BuddyMatchingService {

    private final ProfileRepository profileRepository;
    private final ConnectionRepository connectionRepository;
    private final UserRepository userRepository;
    private final ProfileService profileService;

    public BuddyMatchingService(ProfileRepository profileRepository,
                                ConnectionRepository connectionRepository,
                                UserRepository userRepository,
                                ProfileService profileService) {
        this.profileRepository = profileRepository;
        this.connectionRepository = connectionRepository;
        this.userRepository = userRepository;
        this.profileService = profileService;
    }

    /**
     * Calculates the Compatibility Score between two profiles:
     * - Common subjects: 50%
     * - Shared interests: 20%
     * - Compatible study preferences: 15%
     * - Compatible availability: 15%
     * Total score normalized to 0 - 100%.
     */
    public CompatibilityScoreDTO calculateCompatibility(Profile p1, Profile p2) {
        CompatibilityScoreDTO result = new CompatibilityScoreDTO();

        if (p1 == null || p2 == null) {
            result.setOverallScore(0);
            result.setExplanation("Insufficient profile data for matching calculation.");
            return result;
        }

        // 1. Common Subjects (50% max)
        Set<String> subjects1 = p1.getSubjects() != null
                ? p1.getSubjects().stream().map(Subject::getName).collect(Collectors.toSet())
                : Collections.emptySet();
        Set<String> subjects2 = p2.getSubjects() != null
                ? p2.getSubjects().stream().map(Subject::getName).collect(Collectors.toSet())
                : Collections.emptySet();

        Set<String> commonSubjects = new HashSet<>(subjects1);
        commonSubjects.retainAll(subjects2);
        result.setCommonSubjects(new ArrayList<>(commonSubjects));

        double subjectsScore = 0.0;
        int minSubjectCount = Math.min(subjects1.size(), subjects2.size());
        if (minSubjectCount > 0 && !commonSubjects.isEmpty()) {
            double ratio = (double) commonSubjects.size() / minSubjectCount;
            subjectsScore = Math.min(50.0, ratio * 50.0);
        }
        result.setSubjectsScore(Math.round(subjectsScore * 10.0) / 10.0);

        // 2. Shared Interests (20% max)
        Set<String> interests1 = parseTokens(p1.getInterests());
        Set<String> interests2 = parseTokens(p2.getInterests());

        Set<String> sharedInterests = new HashSet<>(interests1);
        sharedInterests.retainAll(interests2);
        result.setSharedInterests(new ArrayList<>(sharedInterests));

        double interestsScore = 0.0;
        int minInterestsCount = Math.min(interests1.size(), interests2.size());
        if (minInterestsCount > 0 && !sharedInterests.isEmpty()) {
            double ratio = (double) sharedInterests.size() / minInterestsCount;
            interestsScore = Math.min(20.0, ratio * 20.0);
        }
        result.setInterestsScore(Math.round(interestsScore * 10.0) / 10.0);

        // 3. Compatible Study Preferences (15% max)
        List<String> matchedPreferences = new ArrayList<>();
        double preferenceScore = 0.0;
        String pref1 = p1.getPreferredStudyMethod() != null ? p1.getPreferredStudyMethod().trim().toLowerCase() : "";
        String pref2 = p2.getPreferredStudyMethod() != null ? p2.getPreferredStudyMethod().trim().toLowerCase() : "";

        if (!pref1.isEmpty() && !pref2.isEmpty()) {
            if (pref1.equalsIgnoreCase(pref2)) {
                preferenceScore = 15.0;
                matchedPreferences.add(p1.getPreferredStudyMethod());
            } else if (pref1.contains("hybrid") || pref2.contains("hybrid")
                    || (pref1.contains("online") && pref2.contains("online"))
                    || (pref1.contains("in-person") && pref2.contains("in-person"))
                    || (pref1.contains("quiet") && pref2.contains("quiet"))) {
                preferenceScore = 10.0;
                matchedPreferences.add("Compatible Method (" + p1.getPreferredStudyMethod() + " & " + p2.getPreferredStudyMethod() + ")");
            } else {
                preferenceScore = 4.0; // Partial baseline compatibility
            }
        }
        result.setMatchedPreferences(matchedPreferences);
        result.setPreferenceScore(Math.round(preferenceScore * 10.0) / 10.0);

        // 4. Compatible Availability (15% max)
        Set<String> times1 = parseTokens(p1.getAvailableStudyTimes());
        Set<String> times2 = parseTokens(p2.getAvailableStudyTimes());

        Set<String> commonTimes = new HashSet<>(times1);
        commonTimes.retainAll(times2);
        result.setMatchedAvailability(new ArrayList<>(commonTimes));

        double availabilityScore = 0.0;
        if (!commonTimes.isEmpty()) {
            if (commonTimes.size() >= 2) {
                availabilityScore = 15.0;
            } else {
                availabilityScore = 10.0;
            }
        } else if (!times1.isEmpty() && !times2.isEmpty()) {
            availabilityScore = 3.0; // Both have active schedules
        }
        result.setAvailabilityScore(Math.round(availabilityScore * 10.0) / 10.0);

        // Total normalized score (0 - 100)
        int totalScore = (int) Math.round(subjectsScore + interestsScore + preferenceScore + availabilityScore);
        if (totalScore > 100) totalScore = 100;
        if (totalScore < 0) totalScore = 0;
        result.setOverallScore(totalScore);

        // Build friendly human-readable explanation
        StringBuilder explanation = new StringBuilder();
        explanation.append(totalScore).append("% Match: ");
        List<String> highlights = new ArrayList<>();

        if (!commonSubjects.isEmpty()) {
            highlights.add(commonSubjects.size() + " common subject" + (commonSubjects.size() > 1 ? "s" : "")
                    + " (" + String.join(", ", commonSubjects) + ")");
        }
        if (!sharedInterests.isEmpty()) {
            highlights.add(sharedInterests.size() + " shared interest" + (sharedInterests.size() > 1 ? "s" : "")
                    + " (" + String.join(", ", sharedInterests) + ")");
        }
        if (!matchedPreferences.isEmpty()) {
            highlights.add("compatible study method: " + String.join(", ", matchedPreferences));
        }
        if (!commonTimes.isEmpty()) {
            highlights.add("overlapping schedule: " + String.join(", ", commonTimes));
        }

        if (highlights.isEmpty()) {
            explanation.append("Great prospective partner looking for university study buddies!");
        } else {
            explanation.append(String.join(" | ", highlights));
        }

        result.setExplanation(explanation.toString());
        return result;
    }

    public List<BuddyRecommendationDTO> getRecommendations(Long currentUserId,
                                                           String subjectQuery,
                                                           String universityFilter,
                                                           String courseFilter,
                                                           Integer yearFilter,
                                                           String searchKeyword) {
        Profile currentProfile = profileRepository.findByUserId(currentUserId).orElse(null);
        List<Profile> otherProfiles = profileRepository.findAllExcludingUser(currentUserId);

        Map<Long, Connection> connectionMap = new HashMap<>();
        List<Connection> userConnections = connectionRepository.findAllConnectionsByUserId(currentUserId);
        for (Connection c : userConnections) {
            Long otherId = c.getRequester().getId().equals(currentUserId)
                    ? c.getReceiver().getId()
                    : c.getRequester().getId();
            connectionMap.put(otherId, c);
        }

        List<BuddyRecommendationDTO> recommendations = new ArrayList<>();

        for (Profile p : otherProfiles) {
            User user = p.getUser();
            if (user == null || !user.isActive()) {
                continue;
            }

            // Apply filters if provided
            if (universityFilter != null && !universityFilter.isBlank() &&
                    (p.getUniversity() == null || !p.getUniversity().toLowerCase().contains(universityFilter.toLowerCase()))) {
                continue;
            }

            if (courseFilter != null && !courseFilter.isBlank() &&
                    (p.getCourse() == null || !p.getCourse().toLowerCase().contains(courseFilter.toLowerCase()))) {
                continue;
            }

            if (yearFilter != null && p.getYearOfStudy() != null && !p.getYearOfStudy().equals(yearFilter)) {
                continue;
            }

            if (subjectQuery != null && !subjectQuery.isBlank()) {
                boolean hasSubject = p.getSubjects().stream().anyMatch(s ->
                        s.getName().toLowerCase().contains(subjectQuery.toLowerCase()) ||
                        s.getCode().toLowerCase().contains(subjectQuery.toLowerCase()));
                if (!hasSubject) {
                    continue;
                }
            }

            if (searchKeyword != null && !searchKeyword.isBlank()) {
                String kw = searchKeyword.toLowerCase();
                boolean matches = (user.getName() != null && user.getName().toLowerCase().contains(kw)) ||
                        (p.getBio() != null && p.getBio().toLowerCase().contains(kw)) ||
                        (p.getInterests() != null && p.getInterests().toLowerCase().contains(kw)) ||
                        (p.getPreferredStudyMethod() != null && p.getPreferredStudyMethod().toLowerCase().contains(kw));
                if (!matches) {
                    continue;
                }
            }

            // Connection state relative to current user
            String connectionStatus = "NONE";
            Long connectionId = null;
            if (connectionMap.containsKey(user.getId())) {
                Connection c = connectionMap.get(user.getId());
                connectionId = c.getId();
                if (c.getStatus() == ConnectionStatus.ACCEPTED) {
                    connectionStatus = "ACCEPTED";
                } else if (c.getStatus() == ConnectionStatus.PENDING) {
                    if (c.getRequester().getId().equals(currentUserId)) {
                        connectionStatus = "PENDING_SENT";
                    } else {
                        connectionStatus = "PENDING_RECEIVED";
                    }
                } else if (c.getStatus() == ConnectionStatus.REJECTED) {
                    connectionStatus = "REJECTED";
                }
            }

            CompatibilityScoreDTO score = calculateCompatibility(currentProfile, p);

            UserDTO userDTO = new UserDTO(user.getId(), user.getEmail(), user.getName(), user.getRole(), user.isActive());
            ProfileDTO profileDTO = profileService.toDTO(p);

            recommendations.add(new BuddyRecommendationDTO(userDTO, profileDTO, score, connectionStatus, connectionId));
        }

        // Sort descending by overallScore
        recommendations.sort((a, b) -> Integer.compare(
                b.getCompatibility().getOverallScore(),
                a.getCompatibility().getOverallScore()
        ));

        return recommendations;
    }

    private Set<String> parseTokens(String raw) {
        if (raw == null || raw.isBlank()) {
            return Collections.emptySet();
        }
        return Arrays.stream(raw.split("[,;]+"))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }
}
