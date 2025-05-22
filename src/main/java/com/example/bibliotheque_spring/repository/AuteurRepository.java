package com.example.bibliotheque_spring.repository;

import com.example.bibliotheque_spring.entity.Auteur;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuteurRepository extends JpaRepository<Auteur, Long> {}
