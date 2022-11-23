package com.example.project_restaurants.Models;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    public Product findByName(String name);
}
