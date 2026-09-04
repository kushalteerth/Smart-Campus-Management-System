package com.smartcampus.exception;

public class Exceptions {
    
    public static class ResourceNotFoundException extends RuntimeException {
        public ResourceNotFoundException(String message) {
            super(message);
        }
    }
    
    public static class DuplicateIdException extends RuntimeException {
        private final String code;
        private final String field;
        
        public DuplicateIdException(String code, String message, String field) {
            super(message);
            this.code = code;
            this.field = field;
        }
        
        public String getCode() { return code; }
        public String getField() { return field; }
    }
    
    public static class InvalidRouteException extends RuntimeException {
        public InvalidRouteException(String message) {
            super(message);
        }
    }
    
    public static class UnauthorizedAccessException extends RuntimeException {
        public UnauthorizedAccessException(String message) {
            super(message);
        }
    }
    
    public static class InvalidCredentialsException extends RuntimeException {
        public InvalidCredentialsException(String message) {
            super(message);
        }
    }
}
