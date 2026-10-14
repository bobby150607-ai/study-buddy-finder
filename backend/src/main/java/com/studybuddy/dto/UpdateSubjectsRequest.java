package com.studybuddy.dto;

import java.util.List;

public class UpdateSubjectsRequest {
    private List<Long> subjectIds;

    public UpdateSubjectsRequest() {}

    public UpdateSubjectsRequest(List<Long> subjectIds) {
        this.subjectIds = subjectIds;
    }

    public List<Long> getSubjectIds() {
        return subjectIds;
    }

    public void setSubjectIds(List<Long> subjectIds) {
        this.subjectIds = subjectIds;
    }
}
