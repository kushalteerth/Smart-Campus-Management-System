package com.smartcampus.controller;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.dto.common.ApiResponse;
import com.smartcampus.service.FacilityService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facilities")
public class FacilityController {

    @Autowired
    private FacilityService facilityService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FacilityDTO>>> getAllFacilities() {
        return ResponseEntity.ok(ApiResponse.success(facilityService.getAllFacilities(), "Facilities retrieved"));
    }

    @GetMapping("/{facilityId}")
    public ResponseEntity<ApiResponse<FacilityDTO>> getFacilityById(@PathVariable String facilityId) {
        return ResponseEntity.ok(ApiResponse.success(facilityService.getFacilityById(facilityId), "Facility retrieved"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<FacilityDTO>> createFacility(@Valid @RequestBody CreateFacilityRequest request) {
        FacilityDTO response = facilityService.createFacility(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Facility created successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{facilityId}")
    public ResponseEntity<ApiResponse<FacilityDTO>> updateFacility(
            @PathVariable String facilityId,
            @Valid @RequestBody CreateFacilityRequest request) {
        FacilityDTO response = facilityService.updateFacility(facilityId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Facility updated successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{facilityId}")
    public ResponseEntity<ApiResponse<Void>> deleteFacility(@PathVariable String facilityId) {
        facilityService.deleteFacility(facilityId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
