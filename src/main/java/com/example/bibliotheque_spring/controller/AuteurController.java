package com.example.bibliotheque_spring.controller;
import com.example.bibliotheque_spring.DTO.*;

import java.util.List;
import com.example.bibliotheque_spring.entity.*;
import com.example.bibliotheque_spring.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.bibliotheque_spring.repository.UtilisateurRepository;
import java.util.Optional;
import com.example.bibliotheque_spring.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/auteurs")
public class AuteurController {
    private final AuteurService auteurService;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtUtil jwtUtil;
    
    @Autowired
    public AuteurController(AuteurService auteurService, UtilisateurRepository utilisateurRepository, JwtUtil jwtUtil) {
        this.auteurService = auteurService;
        this.utilisateurRepository = utilisateurRepository;
        this.jwtUtil = jwtUtil;
    }
    
    @GetMapping
    public List<Auteur> getAllAuteurs() {
        return auteurService.getAllAuteurs();
    }
    
    @PostMapping
    public Object createAuteur(@RequestBody AuteurCreateDTO auteurDTO, @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body("Accès refusé");
        return auteurService.createAuteur(auteurDTO);
    }
    
    @PutMapping("/{id}")
    public Object updateAuteur(@PathVariable Long id, @RequestBody AuteurUpdateDTO auteurDTO, @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body("Accès refusé");
        return auteurService.updateAuteur(id, auteurDTO);
    }
    
    @DeleteMapping("/{id}")
    public Object deleteAuteur(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body("Accès refusé");
        auteurService.deleteAuteur(id);
        return ResponseEntity.ok().build();
    }
    
    private boolean isAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        String token = authHeader.substring(7);
        String username = jwtUtil.extractUsernameStatic(token);
        Optional<Utilisateur> userOpt = utilisateurRepository.findByUsername(username);
        return userOpt.isPresent() && "ADMIN".equals(userOpt.get().getRole());
    }
}
