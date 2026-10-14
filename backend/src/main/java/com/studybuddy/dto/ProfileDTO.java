package com.studybuddy.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ProfileDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String university;
    private String course;
    private Integer yearOfStudy;
    private String bio;
    private String avatarUrl;
    private String interests;
    private String preferredStudyMethod;
    private String availableStudyTimes;
    private List<SubjectDTO> subjects;
    private LocalDateTime updatedAt;

    public ProfileDTO() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUniversity() {
        return university;
    }

    public void setUniversity(String university) {
        this.university = university;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getPreferredStudyMethod() {
        return preferredStudyMethod;
    }

    public void setPreferredStudyMethod(String preferredStudyMethod) {
        this.preferredStudyMethod = preferredStudyMethod;
    }

    public String getAvailableStudyTimes() {
        return availableStudyTimes;
    }

    public void setAvailableStudyTimes(String availableStudyTimes) {
        this.availableStudyTimes = availableStudyTimes;
    }

    public List<SubjectDTO> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<SubjectDTO> subjects) {
        this.subjects = subjects;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
