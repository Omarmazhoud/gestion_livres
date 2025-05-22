package com.example.bibliotheque_spring.repository;

import com.example.bibliotheque_spring.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository < Genre , Long > {}
