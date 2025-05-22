package com.example.bibliotheque_spring.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bibliotheque_spring.DTO.EmpruntCreateDTO;
import com.example.bibliotheque_spring.entity.Emprunt;
import com.example.bibliotheque_spring.service.EmpruntService;
import com.example.bibliotheque_spring.repository.UtilisateurRepository;
import com.example.bibliotheque_spring.entity.Utilisateur;
import com.example.bibliotheque_spring.security.JwtUtil;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.beans.factory.annotation.Autowired;


@RestController
@RequestMapping("/api/emprunts")
public class EmpruntController {
    private final EmpruntService empruntService;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public EmpruntController(EmpruntService empruntService, UtilisateurRepository utilisateurRepository, JwtUtil jwtUtil) {
        this.empruntService = empruntService;
        this.utilisateurRepository = utilisateurRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public List<Emprunt> getAllEmprunts() {
        return empruntService.getAllEmprunts();
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Emprunt> getEmpruntById(@PathVariable Long id) {
        return empruntService.getEmpruntById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Emprunt createEmprunt(@RequestBody EmpruntCreateDTO empruntCreateDTO) {
        return empruntService.createEmprunt(empruntCreateDTO);
    }
    
    @PostMapping("/emprunter")
    public Emprunt postMethodName(@RequestBody EmpruntCreateDTO empruntCreateDTO) {
        return empruntService.createEmprunt(empruntCreateDTO);
    }

    @PutMapping("/retourner/{id}")
    public void retournerEmprunt(@PathVariable Long id) {
        empruntService.retourner(id);
    }
    
    @PostMapping("/{id}/return")
    public ResponseEntity<Void> returnBook(@PathVariable Long id) {
        empruntService.retourner(id);
        return ResponseEntity.ok().build();
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEmprunt(@PathVariable Long id) {
        empruntService.deleteEmprunt(id);
        return ResponseEntity.ok().build();
    }

    private String extractUsername(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsernameStatic(token);
        return username;
    }
}
