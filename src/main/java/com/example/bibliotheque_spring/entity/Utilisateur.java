package com.example.bibliotheque_spring.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import java.util.Collection;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.ArrayList;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
public class Utilisateur implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    
    @Column(unique = true)
    private String username;
    
    private String password;

    private String email;

    private String telephone;

    private String role = "USER";

    @OneToMany(mappedBy = "utilisateur")
    @JsonManagedReference
    private List<Emprunt> historiqueEmprunts;

    public void setHistoriqueEmprunts(Emprunt emprunt){
        this.historiqueEmprunts.add(emprunt);
    }

    // UserDetails implementation
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return new ArrayList<>();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
