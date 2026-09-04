package com.smartcampus.controller;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.dto.common.ApiResponse;
import com.smartcampus.service.TimetableService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
public class TimetableController {

    @Autowired
    private TimetableService timetableService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<TimetableDTO>> createTimetable(@Valid @RequestBody CreateTimetableRequest request) {
        TimetableDTO response = timetableService.createTimetable(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Timetable entry created successfully"));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<ApiResponse<List<TimetableDTO>>> getTimetableByStudentId(@PathVariable String studentId) {
        // Here we could add a check if current user is STUDENT, they can only view their own
        // If ADMIN, they can view anyone's
        return ResponseEntity.ok(ApiResponse.success(timetableService.getTimetableByStudentId(studentId), "Timetable retrieved"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTimetable(@PathVariable Long id) {
        timetableService.deleteTimetable(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
