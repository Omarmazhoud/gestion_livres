package com.example.bibliotheque_spring.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;

import java.time.LocalDate;

@Entity
@Data
public class Emprunt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "livre_id")
    private Livre livre;

    @ManyToOne
    @JoinColumn(name = "utilisateur_id")
    @JsonBackReference
    private Utilisateur utilisateur;

    private LocalDate dateEmprunt;

    private LocalDate dateRetourPrevu;
}
