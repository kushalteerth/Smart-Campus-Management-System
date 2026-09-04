package com.smartcampus.dto.route;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

public class RouteDTOs {

    @Data
    public static class RouteFinderRequest {
        @NotBlank
        private String sourceLocationId;
        @NotBlank
        private String destinationLocationId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RouteFinderResponse {
        private List<String> path;
        private List<String> pathNames;
        private Double totalDistance;
        private boolean reachable;
        private String algorithm;
        private String message;

        public static RouteFinderResponse noPath(String sourceId, String destId) {
            return new RouteFinderResponse(null, null, null, false, null, "No path exists between selected locations");
        }
    }
}
