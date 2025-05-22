package com.example.bibliotheque_spring;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.bibliotheque_spring.entity.Utilisateur;
import com.example.bibliotheque_spring.repository.UtilisateurRepository;

@SpringBootApplication
public class BibliothequeSpringApplication {

	public static void main(String[] args) {
		SpringApplication.run(BibliothequeSpringApplication.class, args);
	}

	@Bean
	public CommandLineRunner initAdmin(UtilisateurRepository utilisateurRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (utilisateurRepository.count() == 0) {
				Utilisateur admin = new Utilisateur();
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("admin123"));
				admin.setNom("Administrateur");
				admin.setEmail("admin@admin.com");
				admin.setTelephone("0000000000");
				utilisateurRepository.save(admin);
				System.out.println("Utilisateur admin créé : admin / admin123");
			}
		};
	}

}
