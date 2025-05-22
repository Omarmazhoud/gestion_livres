package com.example.bibliotheque_spring.DTO;

import lombok.Data;

@Data
public class AuthenticationResponse {
    private String token;

    public AuthenticationResponse(String token) {
        this.token = token;
    }
} 