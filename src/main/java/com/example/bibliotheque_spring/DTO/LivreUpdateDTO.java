package com.example.bibliotheque_spring.DTO;

public class LivreUpdateDTO {
    private String titre;
    private String isbn;
    private Boolean disponible;
    private Long auteurId;
    private Long genreId;

    public String getTitre() {
        return titre;
    }
    public void setTitre(String titre) {
        this.titre = titre;
    }
    public String getIsbn() {
        return isbn;
    }
    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }
    public Boolean getDisponible() {
        return disponible;
    }
    public void setDisponible(Boolean disponible) {
        this.disponible = disponible;
    }
    public Long getAuteurId() {
        return auteurId;
    }
    public void setAuteurId(Long auteurId) {
        this.auteurId = auteurId;
    }
    public Long getGenreId() {
        return genreId;
    }
    public void setGenreId(Long genreId) {
        this.genreId = genreId;
    
}
}
