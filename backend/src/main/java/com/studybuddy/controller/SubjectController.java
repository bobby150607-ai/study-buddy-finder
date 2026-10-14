package com.studybuddy.controller;

import com.studybuddy.dto.ApiResponse;
import com.studybuddy.dto.SubjectDTO;
import com.studybuddy.service.SubjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SubjectDTO>>> getAllSubjects() {
        List<SubjectDTO> subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(ApiResponse.success("Available subjects", subjects));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SubjectDTO>> getSubjectById(@PathVariable Long id) {
        SubjectDTO subject = subjectService.getSubjectById(id);
        return ResponseEntity.ok(ApiResponse.success("Subject details", subject));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SubjectDTO>> createSubject(@Valid @RequestBody SubjectDTO dto) {
        SubjectDTO created = subjectService.createSubject(dto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Subject created successfully", created));
    }
}
