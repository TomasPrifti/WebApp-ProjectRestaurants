package com.example.project_restaurants.Models;

import java.sql.Date;

import javax.persistence.*;

@Entity
@Table(name = "transactions")
public class Transactions {

    @EmbeddedId
    private IDTransaction idTransaction;
    private Date date;
    private Long quantity;
    private float cost;
    private float totalCost;

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

    public IDTransaction getTransaction() {
        return idTransaction;
    }

    public void setTransaction(IDTransaction idTransaction) {
        this.idTransaction = idTransaction;
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
        return "Transactions [cost=" + cost + ", date=" + date + ", quantity=" + quantity + ", totalCost=" + totalCost
                + ", idTransaction=" + idTransaction + "]";
    }

}
