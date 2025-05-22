package com.example.bibliotheque_spring.repository;

import com.example.bibliotheque_spring.entity.Emprunt;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpruntRepository extends JpaRepository <Emprunt , Long> {}