package com.example.project_restaurants.Models;

import org.springframework.data.jpa.repository.JpaRepository;

public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    public Restaurant findByUsername(String username);
}
