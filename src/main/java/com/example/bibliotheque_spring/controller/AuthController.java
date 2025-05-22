package com.example.bibliotheque_spring.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.example.bibliotheque_spring.DTO.*;
import com.example.bibliotheque_spring.entity.Utilisateur;
import com.example.bibliotheque_spring.repository.UtilisateurRepository;
import com.example.bibliotheque_spring.security.JwtUtil;
import com.example.bibliotheque_spring.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    //private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthService authService;

    public AuthController(
            AuthenticationManager authenticationManager,
            UtilisateurRepository utilisateurRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil,
            AuthService authService) {
      //  this.authenticationManager = authenticationManager;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (utilisateurRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setUsername(request.getUsername());
        utilisateur.setPassword(passwordEncoder.encode(request.getPassword()));
        utilisateur.setNom(request.getNom());
        utilisateur.setEmail(request.getEmail());
        utilisateur.setTelephone(request.getTelephone());
        if (request.getRole() != null && (request.getRole().equals("ADMIN") || request.getRole().equals("USER"))) {
            utilisateur.setRole(request.getRole());
        } else {
            utilisateur.setRole("USER");
        }
        utilisateurRepository.save(utilisateur);

        String token = jwtUtil.generateToken(utilisateur);
        return ResponseEntity.ok(new AuthenticationResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        // Delegate authentication to the AuthService
        AuthenticationResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }
} 