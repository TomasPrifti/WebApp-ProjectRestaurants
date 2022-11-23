package com.example.project_restaurants.Models;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, IDTransaction> {

}
