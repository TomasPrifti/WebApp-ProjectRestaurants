package com.example.project_restaurants.Models;

import javax.persistence.*;

@Entity
@Table(name = "suppliers_products")
public class SuppliersProducts {

    @EmbeddedId
    private IDSupplierProduct idSupplierProduct;
    private Long quantity;
    private float cost;

    @ManyToOne
    @JoinColumn(name = "idSupplier", insertable = false, updatable = false)
    Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "idProduct", insertable = false, updatable = false)
    Product product;

    /* Getters and Setters */

    public IDSupplierProduct getIdSupplierProduct() {
        return idSupplierProduct;
    }

    public void setIdSupplierProduct(IDSupplierProduct idSupplierProduct) {
        this.idSupplierProduct = idSupplierProduct;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    public float getCost() {
        return cost;
    }

    public void setCost(float cost) {
        this.cost = cost;
    }

    /* ToString */
    @Override
    public String toString() {
        return "SuppliersProducts [cost=" + cost + ", idSupplierProduct=" + idSupplierProduct + ", quantity=" + quantity
                + "]";
    }

}
