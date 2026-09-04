package com.smartcampus.controller;

import com.smartcampus.dto.common.ApiResponse;
import com.smartcampus.dto.user.VisitorDTOs.VisitorDTO;
import com.smartcampus.dto.user.VisitorDTOs.VisitorFeedbackRequest;
import com.smartcampus.exception.Exceptions.ResourceNotFoundException;
import com.smartcampus.model.Visitor;
import com.smartcampus.repository.VisitorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/visitors")
public class VisitorController {

    @Autowired
    private VisitorRepository visitorRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<VisitorDTO>>> getAllVisitors() {
        List<VisitorDTO> visitors = visitorRepository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(ApiResponse.success(visitors, "Visitors retrieved"));
    }

    @PreAuthorize("hasRole('VISITOR')")
    @PutMapping("/{id}/feedback")
    public ResponseEntity<ApiResponse<VisitorDTO>> submitFeedback(
            @PathVariable Long id,
            @RequestBody VisitorFeedbackRequest request) {
        Visitor visitor = visitorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor not found"));
        
        visitor.setFeedback(request.getFeedback());
        visitor.setExitTime(LocalDateTime.now());
        Visitor saved = visitorRepository.save(visitor);
        
        return ResponseEntity.ok(ApiResponse.success(toDTO(saved), "Feedback submitted"));
    }

    private VisitorDTO toDTO(Visitor visitor) {
        VisitorDTO dto = new VisitorDTO();
        dto.setId(visitor.getId());
        dto.setName(visitor.getName());
        dto.setEntryTime(visitor.getEntryTime());
        dto.setExitTime(visitor.getExitTime());
        dto.setFeedback(visitor.getFeedback());
        return dto;
    }
}
