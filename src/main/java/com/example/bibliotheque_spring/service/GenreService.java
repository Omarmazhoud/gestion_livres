package com.example.bibliotheque_spring.service;
import com.example.bibliotheque_spring.entity.*;
import com.example.bibliotheque_spring.repository.*;
import org.springframework.stereotype.Service;
import java.util.List;
import com.example.bibliotheque_spring.DTO.*;

@Service
public class GenreService {
    private final GenreRepository genreRepository;

    public GenreService(GenreRepository genreRepository) {
        this.genreRepository = genreRepository;
    }

    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    public Genre createGenre(GenreCreateDTO genreDTO) {
        Genre genre = new Genre();
        genre.setNom(genreDTO.getNom());
        genre.setDescription(genreDTO.getDescription());
        return genreRepository.save(genre);
    }

    public Genre updateGenre(Long id, GenreUpdateDTO genreDTO) {
        return genreRepository.findById(id)
            .map(existingGenre -> {
                existingGenre.setNom(genreDTO.getNom());
                existingGenre.setDescription(genreDTO.getDescription());
                return genreRepository.save(existingGenre);
            })
            .orElseThrow(() -> new RuntimeException("Genre not found"));
        }

    public void deleteGenre(Long id) {
        genreRepository.deleteById(id);
    }

    
}
