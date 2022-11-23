package com.example.project_restaurants.Models;

import java.util.Date;

import javax.persistence.*;

@Entity
@Table(name = "transaction")
public class Transaction {

    @EmbeddedId
    private IDTransaction idTransaction;
    private Date date;
    private Long quantity;
    private float cost;
    private float totalCost;
    private Boolean isConfirmedRestaurant;
    private Boolean isConfirmedSupplier;

    @ManyToOne
    @JoinColumn(name = "idRestaurant", insertable = false, updatable = false)
    Restaurant restaurant;

    @ManyToOne
    @JoinColumn(name = "idSupplier", insertable = false, updatable = false)
    Supplier supplier;

    @ManyToOne
    @JoinColumn(name = "idProduct", insertable = false, updatable = false)
    Product product;

    /* Getters and Setters */

    public IDTransaction getIDTransaction() {
        return idTransaction;
    }

    public void setIDTransaction(IDTransaction idTransaction) {
        this.idTransaction = idTransaction;
    }

    public Boolean getIsConfirmedRestaurant() {
        return isConfirmedRestaurant;
    }

    public void setIsConfirmedRestaurant(Boolean isConfirmedRestaurant) {
        this.isConfirmedRestaurant = isConfirmedRestaurant;
    }

    public Boolean getIsConfirmedSupplier() {
        return isConfirmedSupplier;
    }

    public void setIsConfirmedSupplier(Boolean isConfirmedSupplier) {
        this.isConfirmedSupplier = isConfirmedSupplier;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
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

    public float getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(float totalCost) {
        this.totalCost = totalCost;
    }

    /* ToString */
    @Override
    public String toString() {
        return "Transaction [cost=" + cost + ", date=" + date + ", quantity=" + quantity + ", totalCost=" + totalCost
                + ", idTransaction=" + idTransaction + ", isConfirmedRestaurant=" + isConfirmedRestaurant
                + ", isConfirmedSupplier=" + isConfirmedSupplier + "]";
    }

}
