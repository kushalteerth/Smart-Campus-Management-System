package com.smartcampus.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

public class UserDTOs {

    @Data
    public static class AdminDTO {
        private Long id;
        private String userId;
        private String fullName;
        private String username;
        private String role;
        private String department;
        private String email;
    }

    @Data
    public static class StudentDTO {
        private Long id;
        private String userId;
        private String studentId;
        private String fullName;
        private String username;
        private String role;
        private String program;
        private String department;
        private String section;
        private String year;
    }

    @Data
    public static class CreateAdminRequest {
        @NotBlank
        private String userId;
        @NotBlank
        private String fullName;
        @NotBlank
        private String username;
        @NotBlank
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{1,8}$", message = "Password must be max 8 chars, 1 uppercase, 1 lowercase, 1 number")
        private String password;
        @NotBlank
        private String department;
        @NotBlank
        @Email
        private String email;
    }

    @Data
    public static class CreateStudentRequest {
        @NotBlank
        private String studentId;
        @NotBlank
        private String fullName;
        @NotBlank
        private String username;
        @NotBlank
        @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{1,8}$", message = "Password must be max 8 chars, 1 uppercase, 1 lowercase, 1 number")
        private String password;
        @NotBlank
        private String program;
        private String department;
        private String section;
        @NotBlank
        private String year;
    }
}
