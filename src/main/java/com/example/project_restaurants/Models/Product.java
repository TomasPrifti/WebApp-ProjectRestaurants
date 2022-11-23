package com.example.project_restaurants.Models;

import java.util.*;
import javax.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "product")
    Set<Transaction> transaction;

    @OneToMany(mappedBy = "product")
    Set<SuppliersProducts> suppliersProducts;

    /* Getters and Setters */

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    /* ToString */
    @Override
    public String toString() {
        return "Product [id=" + id + ", name=" + name + "]";
    }
}
