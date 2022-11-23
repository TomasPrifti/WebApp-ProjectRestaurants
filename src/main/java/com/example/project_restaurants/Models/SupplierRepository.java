package com.example.project_restaurants.Models;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    public Supplier findByUsername(String username);
}
