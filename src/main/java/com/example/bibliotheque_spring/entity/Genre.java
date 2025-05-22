package com.example.bibliotheque_spring.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;

    @Column(length = 500)
    private String description;
}
