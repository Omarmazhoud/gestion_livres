package com.example.bibliotheque_spring.DTO;
import java.time.LocalDate;


public class EmpruntCreateDTO {
    private long id;
    private long livreId;
    private long utilisateurId;
    private LocalDate dateEmprunt;
    private LocalDate dateRetourPrevu;

    public long getId(){
        return this.id;
    }

    public long getLivre(){
        return this.livreId;
    }
    
    public long getUtilisateur(){
        return this.utilisateurId;
    }
    
    public LocalDate getDateEmprunt(){
        return this.dateEmprunt;
    }
    
    public LocalDate getDateRetourPrevu(){
        return this.dateRetourPrevu;
    }

    public void setLivreId(long livreId) {
        this.livreId = livreId;
    }

    public void setUtilisateurId(long utilisateurId) {
        this.utilisateurId = utilisateurId;
    }

    public void setDateEmprunt(LocalDate dateEmprunt) {
        this.dateEmprunt = dateEmprunt;
    }

    public void setDateRetourPrevu(LocalDate dateRetourPrevu) {
        this.dateRetourPrevu = dateRetourPrevu;
    }
}
