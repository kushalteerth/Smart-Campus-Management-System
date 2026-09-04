package com.smartcampus.controller;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.dto.common.ApiResponse;
import com.smartcampus.service.LocationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locations")
public class LocationController {

    @Autowired
    private LocationService locationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<LocationDTO>>> getAllLocations() {
        return ResponseEntity.ok(ApiResponse.success(locationService.getAllLocations(), "Locations retrieved"));
    }

    @GetMapping("/{locationId}")
    public ResponseEntity<ApiResponse<LocationDTO>> getLocationById(@PathVariable String locationId) {
        return ResponseEntity.ok(ApiResponse.success(locationService.getLocationById(locationId), "Location retrieved"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<LocationDTO>> createLocation(@Valid @RequestBody CreateLocationRequest request) {
        LocationDTO response = locationService.createLocation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Location created successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{locationId}")
    public ResponseEntity<ApiResponse<LocationDTO>> updateLocation(
            @PathVariable String locationId,
            @Valid @RequestBody CreateLocationRequest request) {
        LocationDTO response = locationService.updateLocation(locationId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Location updated successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{locationId}")
    public ResponseEntity<ApiResponse<Void>> deleteLocation(@PathVariable String locationId) {
        locationService.deleteLocation(locationId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
