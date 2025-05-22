package com.example.bibliotheque_spring.service;

import org.springframework.stereotype.Service;

import com.example.bibliotheque_spring.DTO.EmpruntCreateDTO;
import com.example.bibliotheque_spring.entity.*;
import com.example.bibliotheque_spring.repository.*;
import java.util.List;
import java.util.Optional;

@Service
public class EmpruntService {
    private final EmpruntRepository empruntRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final LivreRepository livreRepository;
    public EmpruntService(EmpruntRepository empruntRepository, UtilisateurRepository utilisateurRepository, LivreRepository livreRepository) {
        this.empruntRepository = empruntRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.livreRepository = livreRepository;
    }

    public List<Emprunt> getAllEmprunts() {
        return empruntRepository.findAll();
    }
    
    public Optional<Emprunt> getEmpruntById(Long id) {
        return empruntRepository.findById(id);
    }

    public Emprunt createEmprunt(EmpruntCreateDTO empruntDTO){
        Emprunt emprunt = new Emprunt();
        emprunt.setLivre(livreRepository.findById(empruntDTO.getLivre()).orElseThrow(() -> new RuntimeException("Livre not found")));
        emprunt.setUtilisateur(utilisateurRepository.findById(empruntDTO.getUtilisateur()).orElseThrow(() -> new RuntimeException("Utilisateur not found")));
        emprunt.setDateEmprunt(empruntDTO.getDateEmprunt());
        emprunt.setDateRetourPrevu(empruntDTO.getDateRetourPrevu());
        Livre livre=emprunt.getLivre();
        livre.setDisponible(false);
        Utilisateur utilisateur=emprunt.getUtilisateur();
        utilisateur.setHistoriqueEmprunts(emprunt);
        return empruntRepository.save(emprunt);
    }

    public void retourner(long id){
        Emprunt emprunt= empruntRepository.findById(id).orElseThrow(() -> new RuntimeException("Emprunt not found"));
        Livre livre=emprunt.getLivre();
        livre.setDisponible(true);
        empruntRepository.deleteById(id);
    }
    
    public void deleteEmprunt(Long id) {
        Optional<Emprunt> empruntOptional = empruntRepository.findById(id);
        if (empruntOptional.isPresent()) {
            Emprunt emprunt = empruntOptional.get();
            // Make the book available again
            Livre livre = emprunt.getLivre();
            if (livre != null) {
                livre.setDisponible(true);
                livreRepository.save(livre);
            }
            // Delete the loan
            empruntRepository.deleteById(id);
        }
    }

    public List<Emprunt> getAllEmpruntsByUser(Long userId) {
        return empruntRepository.findAll().stream()
            .filter(e -> e.getUtilisateur() != null && e.getUtilisateur().getId().equals(userId))
            .toList();
    }
}
