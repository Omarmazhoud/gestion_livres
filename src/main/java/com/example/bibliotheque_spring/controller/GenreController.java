package com.example.bibliotheque_spring.controller;
import com.example.bibliotheque_spring.DTO.*;

import java.util.List;
import com.example.bibliotheque_spring.entity.*;
import com.example.bibliotheque_spring.service.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.bibliotheque_spring.repository.UtilisateurRepository;
import java.util.Optional;
import com.example.bibliotheque_spring.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@RequestMapping("/api/genres")
public class GenreController {
    private final GenreService genreService;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtUtil jwtUtil;
    
    @Autowired
    public GenreController(GenreService genreService, UtilisateurRepository utilisateurRepository, JwtUtil jwtUtil) {
        this.genreService = genreService;
        this.utilisateurRepository = utilisateurRepository;
        this.jwtUtil = jwtUtil;
    }
    
    @GetMapping
    public List<Genre> getAllGenres() {
        return genreService.getAllGenres();
    }
    
    @PostMapping
    public Object createGenre(@RequestBody GenreCreateDTO genreDTO, @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body("Accès refusé");
        return genreService.createGenre(genreDTO);
    }
    
    @PutMapping("/{id}")
    public Object updateGenre(@PathVariable Long id, @RequestBody GenreUpdateDTO genreDTO, @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body("Accès refusé");
        return genreService.updateGenre(id, genreDTO);
    }
    
    @DeleteMapping("/{id}")
    public Object deleteGenre(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        if (!isAdmin(authHeader)) return ResponseEntity.status(403).body("Accès refusé");
        genreService.deleteGenre(id);
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
