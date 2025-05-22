package com.example.bibliotheque_spring.DTO;

import java.time.LocalDate;

public class AuteurUpdateDTO {
    private String nom;
    private LocalDate dateDeNaissance;
    private String biographie;

    
    

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getBiographie() {
        return biographie;
    }

    public void setBiographie(String biographie) {
        this.biographie = biographie;
    }

    public LocalDate getDateDeNaissance() {
        return dateDeNaissance;
    }

    public void setDateDeNaissance(LocalDate dateNaissance) {
        this.dateDeNaissance = dateNaissance;
    }

  

    
    
}
