package com.example.bibliotheque_spring.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.bibliotheque_spring.DTO.UtilisateurCreateDTO;
import com.example.bibliotheque_spring.DTO.UtilisateurUpdateDTO;
import com.example.bibliotheque_spring.entity.Utilisateur;
import com.example.bibliotheque_spring.service.UtilisateurService;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;




@RestController
@RequestMapping("/api/utilisateurs")
public class UtilisateurController {
    private final UtilisateurService utilisateurService;
    public UtilisateurController(UtilisateurService utilisateurService) {
        this.utilisateurService = utilisateurService;
    }

    @GetMapping("getAll")
    public List<Utilisateur> getAll() {
        return this.utilisateurService.getAllUtilisateurs();
    }

    @PostMapping("create")
    public Utilisateur creaUtilisateur(@RequestBody UtilisateurCreateDTO DTO) {        
        return this.utilisateurService.createUtilisateur(DTO);
    }

    @PostMapping("update")
    public Utilisateur updateUtilisateur(@RequestParam Long id, @RequestBody UtilisateurUpdateDTO DTO) {        
        return this.utilisateurService.updateUtilisateur(id, DTO);
    }

    @DeleteMapping("delete")
    public void deleteUtilisateur(@RequestParam Long id) {
        utilisateurService.deleteUtilisateur(id);
    }
    
    
    
}
