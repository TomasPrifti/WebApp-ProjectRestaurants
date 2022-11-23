package com.example.project_restaurants;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class ProjectRestaurantsApplication {

	public static void main(String[] args) {
		SpringApplication.run(ProjectRestaurantsApplication.class, args);
	}

}
