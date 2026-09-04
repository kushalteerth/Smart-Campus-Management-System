package com.smartcampus.controller;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.dto.common.ApiResponse;
import com.smartcampus.service.OperationsService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/operations")
public class OperationsController {

    @Autowired
    private OperationsService operationsService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OperationsDTO>>> getAllOperations() {
        return ResponseEntity.ok(ApiResponse.success(operationsService.getAllOperations(), "Operations retrieved"));
    }

    @GetMapping("/{operationId}")
    public ResponseEntity<ApiResponse<OperationsDTO>> getOperationsById(@PathVariable String operationId) {
        return ResponseEntity.ok(ApiResponse.success(operationsService.getOperationsById(operationId), "Operations retrieved"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<OperationsDTO>> createOperations(@Valid @RequestBody CreateOperationsRequest request) {
        OperationsDTO response = operationsService.createOperations(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Operations created successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{operationId}")
    public ResponseEntity<ApiResponse<OperationsDTO>> updateOperations(
            @PathVariable String operationId,
            @Valid @RequestBody CreateOperationsRequest request) {
        OperationsDTO response = operationsService.updateOperations(operationId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Operations updated successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{operationId}")
    public ResponseEntity<ApiResponse<Void>> deleteOperations(@PathVariable String operationId) {
        operationsService.deleteOperations(operationId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
