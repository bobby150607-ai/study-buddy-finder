package com.studybuddy.dto;

public class UpdateProfileRequest {
    private String name;
    private String university;
    private String course;
    private Integer yearOfStudy;
    private String bio;
    private String avatarUrl;
    private String interests;
    private String preferredStudyMethod;
    private String availableStudyTimes;

    public UpdateProfileRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
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
}
