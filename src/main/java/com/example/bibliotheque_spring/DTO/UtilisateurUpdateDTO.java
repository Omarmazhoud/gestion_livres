package com.example.bibliotheque_spring.DTO;

public class UtilisateurUpdateDTO {
    private String nom;

    private String email;

    private String telephone;

    public String getNom(){
        return this.nom;
    }
    public void setNom(String nom){
        this.nom=nom;
    }

    public String getEmail(){
        return this.email;
    }
    public void setEmail(String nom){
        this.email=nom;
    }

    public String getTelephone(){
        return this.telephone;
    }
    public void setTelephone(String nom){
        this.telephone=nom;
    }
    
}
