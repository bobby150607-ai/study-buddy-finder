package com.studybuddy.dto;

import java.time.LocalDateTime;

public class ConnectionDTO {
    private Long id;
    private Long requesterId;
    private String requesterName;
    private String requesterEmail;
    private String requesterUniversity;
    private String requesterCourse;
    private String requesterAvatar;

    private Long receiverId;
    private String receiverName;
    private String receiverEmail;
    private String receiverUniversity;
    private String receiverCourse;
    private String receiverAvatar;

    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Relative to the requesting user
    private boolean isIncoming;
    private UserDTO otherUser;
    private ProfileDTO otherProfile;

    public ConnectionDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(Long requesterId) {
        this.requesterId = requesterId;
    }

    public String getRequesterName() {
        return requesterName;
    }

    public void setRequesterName(String requesterName) {
        this.requesterName = requesterName;
    }

    public String getRequesterEmail() {
        return requesterEmail;
    }

    public void setRequesterEmail(String requesterEmail) {
        this.requesterEmail = requesterEmail;
    }

    public String getRequesterUniversity() {
        return requesterUniversity;
    }

    public void setRequesterUniversity(String requesterUniversity) {
        this.requesterUniversity = requesterUniversity;
    }

    public String getRequesterCourse() {
        return requesterCourse;
    }

    public void setRequesterCourse(String requesterCourse) {
        this.requesterCourse = requesterCourse;
    }

    public String getRequesterAvatar() {
        return requesterAvatar;
    }

    public void setRequesterAvatar(String requesterAvatar) {
        this.requesterAvatar = requesterAvatar;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getReceiverName() {
        return receiverName;
    }

    public void setReceiverName(String receiverName) {
        this.receiverName = receiverName;
    }

    public String getReceiverEmail() {
        return receiverEmail;
    }

    public void setReceiverEmail(String receiverEmail) {
        this.receiverEmail = receiverEmail;
    }

    public String getReceiverUniversity() {
        return receiverUniversity;
    }

    public void setReceiverUniversity(String receiverUniversity) {
        this.receiverUniversity = receiverUniversity;
    }

    public String getReceiverCourse() {
        return receiverCourse;
    }

    public void setReceiverCourse(String receiverCourse) {
        this.receiverCourse = receiverCourse;
    }

    public String getReceiverAvatar() {
        return receiverAvatar;
    }

    public void setReceiverAvatar(String receiverAvatar) {
        this.receiverAvatar = receiverAvatar;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isIncoming() {
        return isIncoming;
    }

    public void setIncoming(boolean incoming) {
        isIncoming = incoming;
    }

    public UserDTO getOtherUser() {
        return otherUser;
    }

    public void setOtherUser(UserDTO otherUser) {
        this.otherUser = otherUser;
    }

    public ProfileDTO getOtherProfile() {
        return otherProfile;
    }

    public void setOtherProfile(ProfileDTO otherProfile) {
        this.otherProfile = otherProfile;
    }
}
