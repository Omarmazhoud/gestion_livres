package com.example.bibliotheque_spring.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Livre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titre;

    @ManyToOne
    @JoinColumn(name = "auteur_id")
    private Auteur auteur;

    @ManyToOne
    @JoinColumn(name = "genre_id")
    private Genre genre; 

    private String isbn;

    private boolean disponible;
}
