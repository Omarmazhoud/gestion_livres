package com.example.bibliotheque_spring.DTO;

import java.time.LocalDate;


public class EmpruntUpdtaeDTO {
    private long id;
    private long livre_id ;
    private long utilisateur_id;
    private LocalDate dateEmprunt;
    private LocalDate dateRetour;

    public long getId(){
        return this.id;
    }

    public long getLivre(){
        return this.livre_id;
    }
    public long getUtilisateur(){
        return this.utilisateur_id;
    }
    public LocalDate getDateEmprunt(){
        return this.dateEmprunt;
    }
    public LocalDate getDateRetour(){
        return this.dateRetour;
    }


    public void setId(long id){
        this.id=id;
    }

    public void setLivre(long livre){
        this.livre_id=livre;
    }

    public void setUtilisateur(long utilisateur){
        this.utilisateur_id=utilisateur;
    }

    public void setDateEmprunt(LocalDate date){
        this.dateEmprunt=date;
    }

    public void setDateRetour(LocalDate date){
        this.dateRetour=date;
    }

    
}
