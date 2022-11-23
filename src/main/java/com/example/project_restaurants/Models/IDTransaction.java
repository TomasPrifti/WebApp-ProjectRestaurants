package com.example.project_restaurants.Models;

import java.io.Serializable;

import javax.persistence.*;

@Embeddable
public class IDTransaction implements Serializable {

    private Long idTransaction;
    private Long idRestaurant;
    private Long idSupplier;
    private Long idProduct;

    /* Constructors */

    public IDTransaction() {
        
    }

    public IDTransaction(Long idRestaurant, Long idSupplier, Long idProduct) {
        this.idRestaurant = idRestaurant;
        this.idSupplier = idSupplier;
        this.idProduct = idProduct;
    }
    
    /* Getters and Setters */

    public Long getIdTransaction() {
        return idTransaction;
    }

    public void setIdTransaction(Long idTransaction) {
        this.idTransaction = idTransaction;
    }

    public Long getIdRestaurant() {
        return idRestaurant;
    }

    public void setIdRestaurant(Long idRestaurant) {
        this.idRestaurant = idRestaurant;
    }

    public Long getIdSupplier() {
        return idSupplier;
    }

    public void setIdSupplier(Long idSupplier) {
        this.idSupplier = idSupplier;
    }

    public Long getIdProduct() {
        return idProduct;
    }

    public void setIdProduct(Long idProduct) {
        this.idProduct = idProduct;
    }

    /* ToString */
    @Override
    public String toString() {
        return "Transaction [idProduct=" + idProduct + ", idRestaurant=" + idRestaurant + ", idSupplier=" + idSupplier
                + ", idTransaction=" + idTransaction + "]";
    }

}