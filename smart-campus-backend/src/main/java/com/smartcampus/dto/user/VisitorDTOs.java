package com.smartcampus.dto.user;

import lombok.Data;

import java.time.LocalDateTime;

public class VisitorDTOs {

    @Data
    public static class VisitorFeedbackRequest {
        private String feedback;
    }

    @Data
    public static class VisitorDTO {
        private Long id;
        private String name;
        private LocalDateTime entryTime;
        private LocalDateTime exitTime;
        private String feedback;
    }
}
