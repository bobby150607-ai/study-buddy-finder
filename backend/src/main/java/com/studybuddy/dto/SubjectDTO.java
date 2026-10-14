package com.studybuddy.dto;

public class SubjectDTO {
    private Long id;
    private String code;
    private String name;
    private String category;
    private String description;

    public SubjectDTO() {}

    public SubjectDTO(Long id, String code, String name, String category, String description) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.category = category;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
