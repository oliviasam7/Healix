package com.hms.dto;

public class AuthDtos {

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class RegisterRequest {
        public String fullName;
        public String email;
        public String password;
        public String phone;
        public String dob;
        public String gender;
        public String address;
        public String bloodGroup;
    }

    public static class AuthResponse {
        public String token;
        public String email;
        public String fullName;
        public String role;

        public AuthResponse(String token, String email, String fullName, String role) {
            this.token = token;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
        }
    }
}
