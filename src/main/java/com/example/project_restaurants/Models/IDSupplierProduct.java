package com.example.project_restaurants.Models;

import java.io.Serializable;

import javax.persistence.*;

@Embeddable
public class IDSupplierProduct implements Serializable {

    private Long idSupplier;
    private Long idProduct;

    /* Constructors */

    public IDSupplierProduct() {

    }

    public IDSupplierProduct(Long idSupplier, Long idProduct) {
        this.idSupplier = idSupplier;
        this.idProduct = idProduct;
    }

    /* Getters and Setters */

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
        return "IDSupplierProduct [idProduct=" + idProduct + ", idSupplier=" + idSupplier + "]";
    }

}
