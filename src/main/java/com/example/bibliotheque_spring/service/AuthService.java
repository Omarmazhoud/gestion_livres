package com.example.bibliotheque_spring.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.bibliotheque_spring.DTO.AuthenticationRequest;
import com.example.bibliotheque_spring.DTO.AuthenticationResponse;
import com.example.bibliotheque_spring.entity.Utilisateur;
import com.example.bibliotheque_spring.repository.UtilisateurRepository;
import com.example.bibliotheque_spring.security.JwtUtil;

import java.util.Optional;

@Service
public class AuthService {
    
    //private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    
    public AuthService(
            AuthenticationManager authenticationManager,
            UtilisateurRepository utilisateurRepository,
            JwtUtil jwtUtil,
            PasswordEncoder passwordEncoder) {
       // this.authenticationManager = authenticationManager;
        this.utilisateurRepository = utilisateurRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }
    
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // First find the user
        Optional<Utilisateur> userOptional = utilisateurRepository.findByUsername(request.getUsername());
        
        // Check if user exists
        if (userOptional.isEmpty()) {
            throw new BadCredentialsException("Invalid username or password");
        }
        
        Utilisateur user = userOptional.get();
        
        // Manually check if the password matches
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new BadCredentialsException("Invalid username or password");
        }
        
        // Create authentication token after successful validation
        //UsernamePasswordAuthenticationToken authToken = 
            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
            
        // Generate a JWT token
        String token = jwtUtil.generateToken(user);
        
        // Return the response with the token
        return new AuthenticationResponse(token);
    }
} 