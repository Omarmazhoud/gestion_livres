package com.example.bibliotheque_spring.repository;

import com.example.bibliotheque_spring.entity.Livre;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface LivreRepository extends JpaRepository<Livre , Long> {
    
    List<Livre> findByDisponibleTrue();

    
}
