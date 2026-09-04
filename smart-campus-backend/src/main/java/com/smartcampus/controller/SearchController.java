package com.smartcampus.controller;

import com.smartcampus.dto.common.ApiResponse;
import com.smartcampus.dto.route.RouteDTOs.RouteFinderRequest;
import com.smartcampus.dto.route.RouteDTOs.RouteFinderResponse;
import com.smartcampus.dsa.RouteEngine;
import jakarta.validation.Valid;
import com.smartcampus.service.SearchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    @Autowired
    private RouteEngine routeEngine;
    
    @Autowired
    private SearchService searchService;

    @PostMapping("/route")
    public ResponseEntity<ApiResponse<RouteFinderResponse>> findShortestPath(@Valid @RequestBody RouteFinderRequest request) {
        RouteFinderResponse response = routeEngine.findShortestPath(request.getSourceLocationId(), request.getDestinationLocationId());
        return ResponseEntity.ok(ApiResponse.success(response, "Route optimization complete"));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> globalSearch(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(searchService.globalSearch(q, page, size), "Search complete"));
    }
}
