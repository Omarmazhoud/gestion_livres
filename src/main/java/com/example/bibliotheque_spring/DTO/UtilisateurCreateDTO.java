package com.example.bibliotheque_spring.DTO;

public class UtilisateurCreateDTO {
    private String nom;
    private String username;
    private String password;
    private String email;
    private String telephone;

    public String getNom(){
        return this.nom;
    }
    public void setNom(String nom){
        this.nom=nom;
    }

    public String getUsername(){
        return this.username;
    }
    public void setUsername(String username){
        this.username=username;
    }

    public String getPassword(){
        return this.password;
    }
    public void setPassword(String password){
        this.password=password;
    }

    public String getEmail(){
        return this.email;
    }
    public void setEmail(String email){
        this.email=email;
    }

    public String getTelephone(){
        return this.telephone;
    }
    public void setTelephone(String telephone){
        this.telephone=telephone;
    }
}
