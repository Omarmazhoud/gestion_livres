package com.example.bibliotheque_spring.service;
import com.example.bibliotheque_spring.DTO.LivreCreateDTO;
import com.example.bibliotheque_spring.DTO.LivreUpdateDTO;
import com.example.bibliotheque_spring.entity.*;
import com.example.bibliotheque_spring.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;


@Service
public class LivreService {
    private final LivreRepository livreRepository;
    private final AuteurRepository auteurRepository;
    private final GenreRepository genreRepository;

    public LivreService(LivreRepository livreRepository, AuteurRepository auteurRepository, GenreRepository genreRepository) {
        this.livreRepository = livreRepository;
        this.auteurRepository = auteurRepository;
        this.genreRepository = genreRepository;
    }

    public List<Livre> getAllLivres() {
        return livreRepository.findAll();
    }

    public List<Livre> getDisponibleLivres() {
        return livreRepository.findByDisponibleTrue();
    }

    public Livre createLivre(LivreCreateDTO dto) {
        Livre livre = new Livre();
        livre.setTitre(dto.getTitre());
        livre.setIsbn(dto.getIsbn());
        livre.setDisponible(true); // Always true at creation

        Auteur auteur = auteurRepository.findById(dto.getAuteurId())
                .orElseThrow(() -> new RuntimeException("Auteur not found"));
        livre.setAuteur(auteur);

        Genre genre = genreRepository.findById(dto.getGenreId())
                .orElseThrow(() -> new RuntimeException("Genre not found"));
        livre.setGenre(genre);

        return livreRepository.save(livre);
    }

    public Livre updateLivre(Long id, LivreUpdateDTO dto) {
        return livreRepository.findById(id)
            .map(livre -> {
                livre.setTitre(dto.getTitre());
                livre.setIsbn(dto.getIsbn());
                livre.setDisponible(dto.getDisponible());

                Auteur auteur = auteurRepository.findById(dto.getAuteurId())
                        .orElseThrow(() -> new RuntimeException("Auteur not found"));
                livre.setAuteur(auteur);

                Genre genre = genreRepository.findById(dto.getGenreId())
                        .orElseThrow(() -> new RuntimeException("Genre not found"));
                livre.setGenre(genre);

                return livreRepository.save(livre);
            })
            .orElseThrow(() -> new RuntimeException("Livre not found"));
    }

    public void deleteLivre(Long id) {
        livreRepository.deleteById(id);
    }
}