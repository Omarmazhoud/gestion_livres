package com.example.bibliotheque_spring.DTO;

import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String password;
    private String nom;
    private String email;
    private String telephone;
    private String role;
} 