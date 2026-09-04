package com.smartcampus.controller;

import com.smartcampus.dto.common.ApiResponse;
import com.smartcampus.dto.user.UserDTOs.StudentDTO;
import com.smartcampus.service.StudentManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    @Autowired
    private StudentManagementService studentManagementService;

    @GetMapping("/{studentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'STUDENT')")
    public ResponseEntity<ApiResponse<StudentDTO>> getStudentById(@PathVariable String studentId) {
        return ResponseEntity.ok(ApiResponse.success(studentManagementService.getStudentById(studentId), "Student retrieved"));
    }
}
