package com.smartcampus.controller;

import com.smartcampus.dto.common.ApiResponse;
import com.smartcampus.dto.user.UserDTOs.*;
import com.smartcampus.service.AdminService;
import com.smartcampus.service.StudentManagementService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private StudentManagementService studentManagementService;

    // --- Admin Accounts ---
    @PostMapping("/admins")
    public ResponseEntity<ApiResponse<AdminDTO>> createAdmin(@Valid @RequestBody CreateAdminRequest request) {
        AdminDTO response = adminService.createAdmin(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Admin created successfully"));
    }

    @GetMapping("/admins")
    public ResponseEntity<ApiResponse<List<AdminDTO>>> getAllAdmins() {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAllAdmins(), "Admins retrieved"));
    }

    @GetMapping("/admins/{userId}")
    public ResponseEntity<ApiResponse<AdminDTO>> getAdminById(@PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(adminService.getAdminById(userId), "Admin retrieved"));
    }

    @DeleteMapping("/admins/{userId}")
    public ResponseEntity<ApiResponse<Void>> deleteAdmin(@PathVariable String userId) {
        adminService.deleteAdmin(userId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // --- Student Accounts ---
    @PostMapping("/students")
    public ResponseEntity<ApiResponse<StudentDTO>> createStudent(@Valid @RequestBody CreateStudentRequest request) {
        StudentDTO response = studentManagementService.createStudent(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Student created successfully"));
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<StudentDTO>>> getAllStudents() {
        return ResponseEntity.ok(ApiResponse.success(studentManagementService.getAllStudents(), "Students retrieved"));
    }

    @GetMapping("/students/{studentId}")
    public ResponseEntity<ApiResponse<StudentDTO>> getStudentById(@PathVariable String studentId) {
        return ResponseEntity.ok(ApiResponse.success(studentManagementService.getStudentById(studentId), "Student retrieved"));
    }

    @DeleteMapping("/students/{studentId}")
    public ResponseEntity<ApiResponse<Void>> deleteStudent(@PathVariable String studentId) {
        studentManagementService.deleteStudent(studentId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
