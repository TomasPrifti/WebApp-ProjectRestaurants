package com.example.project_restaurants.Models;

import java.util.*;
import javax.persistence.*;

@Entity
@Table(name = "suppliers")
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String username;
    private String password;
    private String email;
    private String name;
    private String address;

    @OneToMany(mappedBy = "supplier")
    Set<Transaction> transaction;

    @OneToMany(mappedBy = "supplier")
    Set<SuppliersProducts> suppliersProducts;

    /* Getters and Setters */

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    /* ToString */
    @Override
    public String toString() {
        return "Supplier [id=" + id + ", username=" + username + ", password=" + password + ", name=" + name
                + ", email=" + email + ", address=" + address + "]";
    }
}
