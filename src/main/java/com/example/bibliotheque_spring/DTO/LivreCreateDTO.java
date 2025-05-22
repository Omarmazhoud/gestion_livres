package com.example.bibliotheque_spring.DTO;
public class LivreCreateDTO {
    private String titre;
    private String isbn;
    private Long auteurId;
    private Long genreId;
    private boolean disponible;


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
    public boolean isDisponible() {
        return disponible;
    }
    public void setDisponible(boolean disponible) {
        this.disponible = disponible;
    }
    


}

    

