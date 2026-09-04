package com.smartcampus.controller;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.dto.common.ApiResponse;
import com.smartcampus.service.RouteService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    @Autowired
    private RouteService routeService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RouteDTO>>> getAllRoutes() {
        return ResponseEntity.ok(ApiResponse.success(routeService.getAllRoutes(), "Routes retrieved"));
    }

    @GetMapping("/{routeId}")
    public ResponseEntity<ApiResponse<RouteDTO>> getRouteById(@PathVariable String routeId) {
        return ResponseEntity.ok(ApiResponse.success(routeService.getRouteById(routeId), "Route retrieved"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<RouteDTO>> createRoute(@Valid @RequestBody CreateRouteRequest request) {
        RouteDTO response = routeService.createRoute(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(response, "Route created successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{routeId}")
    public ResponseEntity<ApiResponse<RouteDTO>> updateRoute(
            @PathVariable String routeId,
            @Valid @RequestBody CreateRouteRequest request) {
        RouteDTO response = routeService.updateRoute(routeId, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Route updated successfully"));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{routeId}")
    public ResponseEntity<ApiResponse<Void>> deleteRoute(@PathVariable String routeId) {
        routeService.deleteRoute(routeId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }
}
