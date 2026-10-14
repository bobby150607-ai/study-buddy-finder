package com.studybuddy.service;

import com.studybuddy.dto.SubjectDTO;
import com.studybuddy.entity.Subject;
import com.studybuddy.exception.BadRequestException;
import com.studybuddy.exception.ResourceNotFoundException;
import com.studybuddy.repository.SubjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SubjectService {

    private final SubjectRepository subjectRepository;

    public SubjectService(SubjectRepository subjectRepository) {
        this.subjectRepository = subjectRepository;
    }

    @Transactional(readOnly = true)
    public List<SubjectDTO> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SubjectDTO getSubjectById(Long id) {
        Subject subject = subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with id: " + id));
        return toDTO(subject);
    }

    public SubjectDTO createSubject(SubjectDTO dto) {
        if (dto.getCode() == null || dto.getCode().isBlank()) {
            throw new BadRequestException("Subject code is required");
        }
        if (dto.getName() == null || dto.getName().isBlank()) {
            throw new BadRequestException("Subject name is required");
        }
        if (subjectRepository.existsByCode(dto.getCode().trim().toUpperCase())) {
            throw new BadRequestException("Subject with code " + dto.getCode() + " already exists");
        }

        Subject subject = new Subject(
                dto.getCode().trim().toUpperCase(),
                dto.getName().trim(),
                dto.getCategory(),
                dto.getDescription()
        );

        Subject saved = subjectRepository.save(subject);
        return toDTO(saved);
    }

    public SubjectDTO toDTO(Subject subject) {
        if (subject == null) return null;
        return new SubjectDTO(
                subject.getId(),
                subject.getCode(),
                subject.getName(),
                subject.getCategory(),
                subject.getDescription()
        );
    }
}
