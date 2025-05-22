package com.example.bibliotheque_spring.service;
import com.example.bibliotheque_spring.DTO.*;
import com.example.bibliotheque_spring.entity.*;
import com.example.bibliotheque_spring.repository.*;
import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class UtilisateurService {
    private final UtilisateurRepository utilisateurRepository;

    public UtilisateurService(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    public Utilisateur createUtilisateur(UtilisateurCreateDTO utilisateurDTO) {
        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNom(utilisateurDTO.getNom());
        utilisateur.setEmail(utilisateurDTO.getEmail());
        utilisateur.setTelephone(utilisateurDTO.getTelephone());
        return utilisateurRepository.save(utilisateur);
    }

    public Utilisateur updateUtilisateur(Long id, UtilisateurUpdateDTO utilisateurDTO) {
        Utilisateur utilisateur = utilisateurRepository.findById(id).orElseThrow(() -> new RuntimeException("Utilisateur not found"));
        utilisateur.setNom(utilisateurDTO.getNom());
        utilisateur.setEmail(utilisateurDTO.getEmail());
        utilisateur.setTelephone(utilisateurDTO.getTelephone());
        return utilisateurRepository.save(utilisateur);
    }

    public List<Utilisateur> getAllUtilisateurs() {
        return  utilisateurRepository.findAll();
    }
    
    public void deleteUtilisateur(Long id) {
        utilisateurRepository.deleteById(id);
    }
}
