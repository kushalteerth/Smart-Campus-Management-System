package com.smartcampus.controller;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.dto.common.ApiResponse;
import com.smartcampus.service.DepartmentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentDTO>>> getAllDepartments() {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getAllDepartments(), "Departments retrieved"));
    }

    @GetMapping("/{departmentId}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> getDepartmentById(@PathVariable String departmentId) {
        return ResponseEntity.ok(ApiResponse.success(departmentService.getDepartmentById(departmentId), "Department retrieved"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<DepartmentDTO>> createDepartment(@Valid @RequestBody CreateDepartmentRequest request) {
        DepartmentDTO response = departmentService.createDepartment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Department created successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{departmentId}")
    public ResponseEntity<ApiResponse<DepartmentDTO>> updateDepartment(
            @PathVariable String departmentId,
            @Valid @RequestBody CreateDepartmentRequest request) {
        DepartmentDTO response = departmentService.updateDepartment(departmentId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Department updated successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{departmentId}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable String departmentId) {
        departmentService.deleteDepartment(departmentId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
