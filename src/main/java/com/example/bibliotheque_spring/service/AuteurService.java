package com.example.bibliotheque_spring.service;
import com.example.bibliotheque_spring.entity.*;
import com.example.bibliotheque_spring.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.bibliotheque_spring.DTO.*;

@Service
public class AuteurService {
    private final AuteurRepository auteurRepository;

    public AuteurService(AuteurRepository auteurRepository) {
        this.auteurRepository = auteurRepository;
    }

    public List<Auteur> getAllAuteurs() {
        return auteurRepository.findAll();
    }

    public Auteur createAuteur(AuteurCreateDTO auteurDTO) {
        Auteur auteur = new Auteur();
        auteur.setNom(auteurDTO.getNom());
        auteur.setDateDeNaissance(auteurDTO.getDateDeNaissance());
        auteur.setBiographie(auteurDTO.getBiographie());
        return auteurRepository.save(auteur);
    }

    public Auteur updateAuteur(Long id, AuteurUpdateDTO auteurDTO) {
        return auteurRepository.findById(id)
            .map(existingAuteur -> {
                existingAuteur.setNom(auteurDTO.getNom());
                existingAuteur.setDateDeNaissance(auteurDTO.getDateDeNaissance());
                existingAuteur.setBiographie(auteurDTO.getBiographie());
                return auteurRepository.save(existingAuteur);
            })
            .orElseThrow(() -> new RuntimeException("Auteur not found"));
    }

    public void deleteAuteur(Long id) {
        auteurRepository.deleteById(id);
    }
    
}
