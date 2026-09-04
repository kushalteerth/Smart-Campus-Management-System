package com.smartcampus.dto.campus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.LocalTime;

public class CampusDTOs {

    @Data
    public static class LocationDTO {
        private String locationId;
        private String name;
        private String description;
        private String building;
        private String floor;
        private String department;
        private Double distance;
        private String status;
        private LocalTime openingTime;
        private LocalTime closingTime;
    }

    @Data
    public static class CreateLocationRequest {
        @NotBlank
        private String locationId;
        @NotBlank
        private String name;
        private String description;
        private String building;
        private String floor;
        private String department;
        private Double distance;
        private String status = "OPEN";
        private LocalTime openingTime;
        private LocalTime closingTime;
    }

    @Data
    public static class DepartmentDTO {
        private String departmentId;
        private String name;
        private String description;
        private String headOfDept;
        private String facilities;
        private String purpose;
        private String timing;
        private String locationId;
        private String locationName;
    }

    @Data
    public static class CreateDepartmentRequest {
        @NotBlank
        private String departmentId;
        @NotBlank
        private String name;
        private String description;
        private String headOfDept;
        private String facilities;
        private String purpose;
        private String timing;
        private String locationId;
    }

    @Data
    public static class FacilityDTO {
        private String facilityId;
        private String name;
        private String description;
        private String facilityType;
        private String locationId;
        private String locationName;
        private boolean isAvailable;
    }

    @Data
    public static class CreateFacilityRequest {
        @NotBlank
        private String facilityId;
        @NotBlank
        private String name;
        private String description;
        private String facilityType;
        private String locationId;
        private boolean isAvailable = true;
    }

    @Data
    public static class RouteDTO {
        private String routeId;
        private String sourceLocationId;
        private String sourceLocationName;
        private String destinationLocationId;
        private String destinationLocationName;
        private Double distance;
        private String description;
        private boolean bidirectional;
    }

    @Data
    public static class CreateRouteRequest {
        @NotBlank
        private String routeId;
        @NotBlank
        private String sourceLocationId;
        @NotBlank
        private String destinationLocationId;
        @NotNull
        @Positive
        private Double distance;
        private String description;
        private boolean bidirectional = true;
    }

    @Data
    public static class OperationsDTO {
        private String operationId;
        private String name;
        private String description;
        private String status;
        private String locationId;
        private String locationName;
        private String operatingHours;
    }

    @Data
    public static class CreateOperationsRequest {
        @NotBlank
        private String operationId;
        @NotBlank
        private String name;
        private String description;
        private String status = "ACTIVE";
        private String locationId;
        private String operatingHours;
    }

    @Data
    public static class TimetableDTO {
        private Long id;
        private String studentId;
        private String subject;
        private String dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
        private String locationId;
        private String locationName;
        private String instructor;
    }

    @Data
    public static class CreateTimetableRequest {
        @NotBlank
        private String studentId;
        @NotBlank
        private String subject;
        @NotBlank
        private String dayOfWeek;
        @NotNull
        private LocalTime startTime;
        @NotNull
        private LocalTime endTime;
        private String locationId;
        private String instructor;
    }
}
