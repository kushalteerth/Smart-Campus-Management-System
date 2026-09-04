package com.smartcampus.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDTOs {
    
    @Data
    public static class LoginRequest {
        @NotBlank(message = "Username is required")
        private String username;
        
        @NotBlank(message = "Password is required")
        private String password;
    }

    @Data
    @AllArgsConstructor
    public static class LoginResponse {
        private String accessToken;
        private String refreshToken;
        private String role;
        private String userId;
    }

    @Data
    public static class VisitorEntryRequest {
        @NotBlank(message = "Name is required")
        private String name;
    }
    
    @Data
    @AllArgsConstructor
    public static class VisitorEntryResponse {
        private String accessToken;
        private Long visitorId;
        private String name;
        private String role;
    }

    @Data
    public static class TokenRefreshRequest {
        @NotBlank(message = "Refresh token is required")
        private String refreshToken;
    }

    @Data
    @AllArgsConstructor
    public static class TokenRefreshResponse {
        private String accessToken;
        private String refreshToken;
    }
}
