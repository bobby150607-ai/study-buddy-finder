package com.studybuddy.dto;

import java.util.List;

public class CompatibilityScoreDTO {
    private int overallScore; // 0 - 100%
    private double subjectsScore; // up to 50
    private double interestsScore; // up to 20
    private double preferenceScore; // up to 15
    private double availabilityScore; // up to 15

    private List<String> commonSubjects;
    private List<String> sharedInterests;
    private List<String> matchedPreferences;
    private List<String> matchedAvailability;
    private String explanation;

    public CompatibilityScoreDTO() {}

    public int getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(int overallScore) {
        this.overallScore = overallScore;
    }

    public double getSubjectsScore() {
        return subjectsScore;
    }

    public void setSubjectsScore(double subjectsScore) {
        this.subjectsScore = subjectsScore;
    }

    public double getInterestsScore() {
        return interestsScore;
    }

    public void setInterestsScore(double interestsScore) {
        this.interestsScore = interestsScore;
    }

    public double getPreferenceScore() {
        return preferenceScore;
    }

    public void setPreferenceScore(double preferenceScore) {
        this.preferenceScore = preferenceScore;
    }

    public double getAvailabilityScore() {
        return availabilityScore;
    }

    public void setAvailabilityScore(double availabilityScore) {
        this.availabilityScore = availabilityScore;
    }

    public List<String> getCommonSubjects() {
        return commonSubjects;
    }

    public void setCommonSubjects(List<String> commonSubjects) {
        this.commonSubjects = commonSubjects;
    }

    public List<String> getSharedInterests() {
        return sharedInterests;
    }

    public void setSharedInterests(List<String> sharedInterests) {
        this.sharedInterests = sharedInterests;
    }

    public List<String> getMatchedPreferences() {
        return matchedPreferences;
    }

    public void setMatchedPreferences(List<String> matchedPreferences) {
        this.matchedPreferences = matchedPreferences;
    }

    public List<String> getMatchedAvailability() {
        return matchedAvailability;
    }

    public void setMatchedAvailability(List<String> matchedAvailability) {
        this.matchedAvailability = matchedAvailability;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}
