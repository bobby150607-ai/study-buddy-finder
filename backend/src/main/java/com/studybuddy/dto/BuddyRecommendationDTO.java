package com.studybuddy.dto;

public class BuddyRecommendationDTO {
    private UserDTO user;
    private ProfileDTO profile;
    private CompatibilityScoreDTO compatibility;
    private String connectionStatus; // NONE, PENDING_SENT, PENDING_RECEIVED, ACCEPTED
    private Long connectionId;

    public BuddyRecommendationDTO() {}

    public BuddyRecommendationDTO(UserDTO user, ProfileDTO profile, CompatibilityScoreDTO compatibility, String connectionStatus, Long connectionId) {
        this.user = user;
        this.profile = profile;
        this.compatibility = compatibility;
        this.connectionStatus = connectionStatus;
        this.connectionId = connectionId;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public ProfileDTO getProfile() {
        return profile;
    }

    public void setProfile(ProfileDTO profile) {
        this.profile = profile;
    }

    public CompatibilityScoreDTO getCompatibility() {
        return compatibility;
    }

    public void setCompatibility(CompatibilityScoreDTO compatibility) {
        this.compatibility = compatibility;
    }

    public String getConnectionStatus() {
        return connectionStatus;
    }

    public void setConnectionStatus(String connectionStatus) {
        this.connectionStatus = connectionStatus;
    }

    public Long getConnectionId() {
        return connectionId;
    }

    public void setConnectionId(Long connectionId) {
        this.connectionId = connectionId;
    }
}
