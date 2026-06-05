package com.mizan.dto;

import lombok.Data;

@Data
public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";
    private UserDto user;

    public JwtAuthResponse(String accessToken, UserDto user) {
        this.accessToken = accessToken;
        this.user = user;
    }

    @Data
    public static class UserDto {
        private Long id;
        private String name;
        private String email;
        private String role;

        public UserDto(Long id, String name, String email, String role) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }
    }
}
