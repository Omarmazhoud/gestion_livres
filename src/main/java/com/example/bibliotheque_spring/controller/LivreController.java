package com.example.bibliotheque_spring.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.*;

import com.example.bibliotheque_spring.DTO.LivreCreateDTO;
import com.example.bibliotheque_spring.DTO.LivreUpdateDTO;
import com.example.bibliotheque_spring.entity.Livre;
import com.example.bibliotheque_spring.service.LivreService;
import org.springframework.http.ResponseEntity;
import com.example.bibliotheque_spring.repository.UtilisateurRepository;
import com.example.bibliotheque_spring.entity.Utilisateur;
import com.example.bibliotheque_spring.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;



@RestController
@RequestMapping("/api/livres")
public class LivreController {
    private final LivreService livreService;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtUtil jwtUtil;

    @Autowired
    public LivreController(LivreService livreService, UtilisateurRepository utilisateurRepository, JwtUtil jwtUtil) {
        this.livreService = livreService;
        this.utilisateurRepository = utilisateurRepository;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/disponibles")
    public List<Livre> getAvailableLivres() {
        return livreService.getDisponibleLivres();
    }

    @GetMapping
    public List<Livre> getAllLivres() {
        return livreService.getAllLivres();
    }

    @PostMapping
    public ResponseEntity<?> createLivre(@RequestBody LivreCreateDTO livreDTO, @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body("Accès refusé");
        return ResponseEntity.ok(livreService.createLivre(livreDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLivre(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body("Accès refusé");
        livreService.deleteLivre(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLivre(@PathVariable Long id, @RequestBody LivreUpdateDTO livreDTO, @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body("Accès refusé");
        try {
            Livre updatedLivre = livreService.updateLivre(id, livreDTO);
            return ResponseEntity.ok(updatedLivre);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    private boolean isAdmin(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return false;
        String token = authHeader.substring(7);
        // Décoder le token JWT pour obtenir le username
        String username = jwtUtil.extractUsernameStatic(token);
        Optional<Utilisateur> userOpt = utilisateurRepository.findByUsername(username);
        return userOpt.isPresent() && "ADMIN".equals(userOpt.get().getRole());
    }
}