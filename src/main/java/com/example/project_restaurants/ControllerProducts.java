package com.example.project_restaurants;

import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.*;

import javax.servlet.http.HttpSession;

import com.example.project_restaurants.Models.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class ControllerProducts {

    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private SuppliersProductsRepository suppliersProductsRepository;
    @Autowired
    private TransactionRepository transactionRepository;

    private String[] result = new String[1];

    @RequestMapping(value = "/products/api1", method = RequestMethod.GET)
    public String[] api1() throws MalformedURLException, IOException {

        URL url = new URL("https://foodish-api.herokuapp.com/api");
        BufferedReader reader = new BufferedReader(new InputStreamReader(url.openStream(), "UTF-8"));
        String str = reader.readLine();
        result[0] = str.substring(10, str.length()-2);

        return result; 
    }

    @RequestMapping(value = "/products/logout", method = RequestMethod.GET)
    public String[] logout(HttpSession session) { 
        session.invalidate();
        result[0] = "logout";
        return result; 
    }

    @RequestMapping(value = "/products/showMyProducts", method = RequestMethod.GET)
    public List<HashMap<String, Object>> showMyProducts(HttpSession session) {

        List<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();
        HashMap<String, Object> obj;
        List<SuppliersProducts> listSuppliersProducts = suppliersProductsRepository.findAll();
        Long id = supplierRepository.findByUsername(session.getAttribute("username").toString()).getId();

        for (SuppliersProducts suppliersProducts : listSuppliersProducts) {
            if(suppliersProducts.getIdSupplierProduct().getIdSupplier() == id) {
                obj = new HashMap<String, Object>();
                obj.put("id", suppliersProducts.getIdSupplierProduct().getIdProduct());
                obj.put("name", productRepository.getById(suppliersProducts.getIdSupplierProduct().getIdProduct()).getName());
                obj.put("quantity", suppliersProducts.getQuantity());
                obj.put("cost", suppliersProducts.getCost());
                list.add(obj);
            }
        }

        return list;
    }

    @RequestMapping(value = "/products/showAllProducts", method = RequestMethod.GET)
    public List<HashMap<String, Object>> showAllProducts(HttpSession session) {

        List<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();
        HashMap<String, Object> obj;
        List<Product> listProduct = productRepository.findAll();
        List<SuppliersProducts> listSuppliersProducts = suppliersProductsRepository.findAll();
        int totalQuantity;

        for (Product product : listProduct) {
            totalQuantity = 0;
            obj = new HashMap<String, Object>();
            obj.put("id", product.getId());
            obj.put("name", product.getName());
            for (SuppliersProducts suppliersProducts : listSuppliersProducts) {
                if(product.getId() == suppliersProducts.getIdSupplierProduct().getIdProduct()) {
                    totalQuantity += suppliersProducts.getQuantity();
                }
            }
            obj.put("quantity", totalQuantity);
            list.add(obj);
        }

        return list;
    }

    @RequestMapping(value = "/products/modifyProduct", method = RequestMethod.POST)
    public String[] modifyProduct(HttpSession session, @RequestParam("id") String productId, @RequestParam("quantity") Long productQuantity, @RequestParam("cost") String productCost) {

        productCost = productCost.replace(",", ".");

        /* Check data */
        if(productQuantity < 0 || productQuantity % 1 != 0 || productQuantity.toString() == "" || productQuantity == null) {
            result[0] = "error_addProduct_quantity";
            return result;    
        }
        if(!checkCost(productCost)) {
            result[0] = "error_addProduct_cost";
            return result;
        }
            
        Long idSupplier = supplierRepository.findByUsername(session.getAttribute("username").toString()).getId();
        SuppliersProducts suppliersProducts = suppliersProductsRepository.findById(new IDSupplierProduct(idSupplier, Long.parseLong(productId))).get();
        suppliersProducts.setQuantity(productQuantity);
        suppliersProducts.setCost(Float.parseFloat(productCost));
        suppliersProductsRepository.save(suppliersProducts);
        
        result[0] = "modifyProduct";
        return result;
    }

    @RequestMapping(value = "/products/deleteProduct", method = RequestMethod.POST)
    public String[] deleteProduct(HttpSession session, @RequestParam("id") String productId) {

        Long IdSupplier = supplierRepository.findByUsername(session.getAttribute("username").toString()).getId();
        SuppliersProducts suppliersProducts = suppliersProductsRepository.findById(new IDSupplierProduct(IdSupplier, Long.parseLong(productId))).get();
        suppliersProductsRepository.delete(suppliersProducts);
    
        result[0] = "deleteProduct";
        return result;
    }

    @RequestMapping(value = "/products/addProduct", method = RequestMethod.POST)
    public String[] addProduct(HttpSession session, @RequestParam("name") String productName, @RequestParam("quantity") Long productQuantity, @RequestParam("cost") String productCost) {

        productCost = productCost.replace(",", ".");

        /* Check data */
        if(!productName.matches("^[a-zA-Zà-ù'\s]{1,20}$")) {
            result[0] = "error_addProduct_name";
            return result;
        }
        if(productQuantity < 0 || productQuantity % 1 != 0 || productQuantity.toString() == "" || productQuantity == null) {
            result[0] = "error_addProduct_quantity";
            return result;    
        }
        if(!checkCost(productCost)) {
            result[0] = "error_addProduct_cost";
            return result;
        }
        productName = productName.toLowerCase();
        Product product = productRepository.findByName(productName);
        SuppliersProducts suppliersProducts = new SuppliersProducts();
        Long idSupplier = supplierRepository.findByUsername(session.getAttribute("username").toString()).getId();

        if (product != null) {
            if(suppliersProductsRepository.findById(new IDSupplierProduct(idSupplier, product.getId())).isPresent()) {
                result[0] = "error_addProduct_name";
                return result;
            }
        } else {
            product = new Product();
            product.setName(productName);
            productRepository.save(product);
        }

        suppliersProducts.setIdSupplierProduct(new IDSupplierProduct(idSupplier, product.getId()));
        suppliersProducts.setQuantity(productQuantity);
        suppliersProducts.setCost(Float.parseFloat(productCost));
        suppliersProductsRepository.save(suppliersProducts);

        result[0] = "addProduct";
        return result;
    }

    @RequestMapping(value = "/products/showSuppliers", method = RequestMethod.POST)
    public List<HashMap<String, Object>> showSuppliers(@RequestParam("id") String idProduct) {

        List<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();
        HashMap<String, Object> obj;

        for (SuppliersProducts suppliersProducts : suppliersProductsRepository.findAll()) {
            if(suppliersProducts.getIdSupplierProduct().getIdProduct() == Long.parseLong(idProduct)) {
                obj = new HashMap<String, Object>();
                obj.put("id", supplierRepository.findById(suppliersProducts.getIdSupplierProduct().getIdSupplier()).get().getId());
                obj.put("name", supplierRepository.findById(suppliersProducts.getIdSupplierProduct().getIdSupplier()).get().getName());
                obj.put("quantity", suppliersProducts.getQuantity());
                obj.put("cost", suppliersProducts.getCost());
                list.add(obj);
            }
        }

        return list;
    }

    @RequestMapping(value = "/products/sendTransaction", method = RequestMethod.POST)
    public String[] sendTransaction(HttpSession session, @RequestParam("idproduct") String idproduct, @RequestParam("idsupplier") String idsupplier, @RequestParam("quantity") Long quantity) {

        if(quantity < 0 || quantity % 1 != 0 || quantity.toString() == "" || quantity == null) {
            result[0] = "error_sendTransaction_quantity";
            return result;    
        }

        Long idProduct = Long.parseLong(idproduct);
        Long idSupplier = Long.parseLong(idsupplier);
        Long idRestaurant = restaurantRepository.findByUsername(session.getAttribute("username").toString()).getId();
        IDSupplierProduct idSupplierProduct = new IDSupplierProduct(idSupplier, idProduct);
        
        SuppliersProducts suppliersProducts = suppliersProductsRepository.findById(idSupplierProduct).get();
        if(suppliersProducts.getQuantity() < quantity) {
            result[0] = "error_sendTransaction_quantity";
            return result;
        }
        float cost = suppliersProducts.getCost();

        for (Transaction transaction : transactionRepository.findAll()) {
            if(transaction.getIDTransaction().getIdRestaurant() == idRestaurant && transaction.getIDTransaction().getIdSupplier() == idSupplier && transaction.getIDTransaction().getIdProduct() == idProduct && transaction.getIsConfirmedRestaurant() == null ) {
                Long newQuantity = quantity + transaction.getQuantity();
                if(suppliersProducts.getQuantity() < newQuantity) {
                    result[0] = "error_sendTransaction_quantity";
                    return result;
                }
                transaction.setQuantity(newQuantity);
                transaction.setTotalCost(newQuantity * cost);
                transactionRepository.save(transaction);
                result[0] = "sendTransaction";
                return result;
            }
        }
        for (Transaction transaction : transactionRepository.findAll()) {
            if(transaction.getIDTransaction().getIdRestaurant() == idRestaurant && transaction.getIDTransaction().getIdSupplier() == idSupplier && transaction.getIsConfirmedRestaurant() == null ) {
                Transaction newTransaction = new Transaction();
                IDTransaction idTransaction = new IDTransaction(idRestaurant, idSupplier, idProduct);
                idTransaction.setIdTransaction(transaction.getIDTransaction().getIdTransaction());
                newTransaction.setIDTransaction(idTransaction);
                newTransaction.setDate(new Date());
                newTransaction.setQuantity(quantity);
                newTransaction.setCost(cost);
                newTransaction.setTotalCost(quantity * cost);
                newTransaction.setIsConfirmedRestaurant(null);
                newTransaction.setIsConfirmedSupplier(null);
                transactionRepository.save(newTransaction);
                result[0] = "sendTransaction";
                return result;
            }
        }

        Transaction transaction = new Transaction();
        IDTransaction idTransaction = new IDTransaction(idRestaurant, idSupplier, idProduct);
        transaction.setIDTransaction(idTransaction);
        transaction.setDate(new Date());
        transaction.setQuantity(quantity);
        transaction.setCost(cost);
        transaction.setTotalCost(quantity * cost);
        transaction.setIsConfirmedRestaurant(null);
        transaction.setIsConfirmedSupplier(null);
        transactionRepository.save(transaction);

        result[0] = "sendTransaction";
        return result;
    }
    
    @RequestMapping(value = "/products/showTransactions", method = RequestMethod.GET)
    public List<HashMap<String, Object>> showTransactions(HttpSession session) {

        List<HashMap<String, Object>> listToReturn = new ArrayList<HashMap<String, Object>>();
        List<HashMap<String, Object>> listProductsToReturn;
        HashMap<String, Object> obj, product;
        float totalCost = 0;

        if (session.getAttribute("user") == "restaurant") {
            for (Transaction transaction1 : transactionRepository.findAll()) {
                if(transaction1.getIDTransaction().getIdRestaurant() == restaurantRepository.findByUsername(session.getAttribute("username").toString()).getId() && !checkIsInList(listToReturn, transaction1.getIDTransaction().getIdTransaction())) {
                    totalCost = 0;
                    obj = new HashMap<String, Object>();
                    obj.put("idTransaction", transaction1.getIDTransaction().getIdTransaction());
                    obj.put("idSupplier", transaction1.getIDTransaction().getIdSupplier());
                    obj.put("name", supplierRepository.findById(transaction1.getIDTransaction().getIdSupplier()).get().getName());
                    obj.put("date", transaction1.getDate());
                    obj.put("isConfirmedRestaurant", transaction1.getIsConfirmedRestaurant());
                    obj.put("isConfirmedSupplier", transaction1.getIsConfirmedSupplier());

                    listProductsToReturn = new ArrayList<HashMap<String, Object>>();
                    obj.put("products", listProductsToReturn);

                    for (Transaction transaction2 : transactionRepository.findAll()) {
                        if(transaction2.getIDTransaction().getIdSupplier() == transaction1.getIDTransaction().getIdSupplier() && transaction2.getIDTransaction().getIdTransaction() == transaction1.getIDTransaction().getIdTransaction() && transaction2.getIDTransaction().getIdRestaurant() == restaurantRepository.findByUsername(session.getAttribute("username").toString()).getId()) {
                            product = new HashMap<String, Object>();
                            product.put("id", transaction2.getIDTransaction().getIdProduct());
                            product.put("name", productRepository.findById(transaction2.getIDTransaction().getIdProduct()).get().getName());
                            product.put("quantity", transaction2.getQuantity());
                            product.put("cost", transaction2.getCost());
                            product.put("totalCost", transaction2.getTotalCost());
                            totalCost += transaction2.getTotalCost();
                            listProductsToReturn.add(product);
                        }
                    }
                    
                    obj.put("totalCost", totalCost);
                    listToReturn.add(obj);
                }
            }
        } else if (session.getAttribute("user") == "supplier") {
            for (Transaction transaction1 : transactionRepository.findAll()) {
                if(transaction1.getIDTransaction().getIdSupplier() == supplierRepository.findByUsername(session.getAttribute("username").toString()).getId() && !checkIsInList(listToReturn, transaction1.getIDTransaction().getIdTransaction()) && transaction1.getIsConfirmedRestaurant() != null) {
                    totalCost = 0;
                    obj = new HashMap<String, Object>();
                    obj.put("idTransaction", transaction1.getIDTransaction().getIdTransaction());
                    obj.put("idRestaurant", transaction1.getIDTransaction().getIdRestaurant());
                    obj.put("name", restaurantRepository.findById(transaction1.getIDTransaction().getIdRestaurant()).get().getName());
                    obj.put("date", transaction1.getDate());
                    obj.put("isConfirmedRestaurant", transaction1.getIsConfirmedRestaurant());
                    obj.put("isConfirmedSupplier", transaction1.getIsConfirmedSupplier());

                    listProductsToReturn = new ArrayList<HashMap<String, Object>>();
                    obj.put("products", listProductsToReturn);

                    for (Transaction transaction2 : transactionRepository.findAll()) {
                        if(transaction2.getIDTransaction().getIdRestaurant() == transaction1.getIDTransaction().getIdRestaurant() && transaction2.getIDTransaction().getIdTransaction() == transaction1.getIDTransaction().getIdTransaction() && transaction2.getIDTransaction().getIdSupplier() == supplierRepository.findByUsername(session.getAttribute("username").toString()).getId()) {
                            product = new HashMap<String, Object>();
                            product.put("name", productRepository.findById(transaction2.getIDTransaction().getIdProduct()).get().getName());
                            product.put("quantity", transaction2.getQuantity());
                            product.put("cost", transaction2.getCost());
                            product.put("totalCost", transaction2.getTotalCost());
                            totalCost += transaction2.getTotalCost();
                            listProductsToReturn.add(product);
                        }
                    }
                    
                    obj.put("totalCost", totalCost);
                    listToReturn.add(obj);
                }
            }
        }

        return listToReturn;

        /* List Returned
            {
                [0] = {
                        "idTransaction": "...",
                        "idSupplier" or "idRestaurant": "...",
                        "name" : "...",
                        "date" : "...",
                        "totalCost": "...",
                        "products" : {
                            [0] = {
                                "id": "...", ----> Only Restaurant
                                "name": "...",
                                "quantity": ...,
                                "cost": ...,
                                "totalCost": "..."
                            },
                            [1] = ........
                        }
                    },
                [1] = ........
            }
        */
    }

    @RequestMapping(value = "/products/transactionDeleteProduct", method = RequestMethod.POST)
    public String[] transactionDeleteProduct(HttpSession session, @RequestParam("idTransaction") String transactionId, @RequestParam("idSupplier") String supplierId, @RequestParam("idProduct") String productId) {
        
        if(session.getAttribute("user") != "restaurant") {
            result[0] = "Error: transactionDeleteProduct";
            return result;
        }

        Long idTransaction = Long.parseLong(transactionId);
        Long idRestaurant = restaurantRepository.findByUsername(session.getAttribute("username").toString()).getId();
        Long idSupplier = Long.parseLong(supplierId);
        Long idProduct = Long.parseLong(productId);

        for (Transaction transaction : transactionRepository.findAll()) {
            if(transaction.getIDTransaction().getIdTransaction() == idTransaction && transaction.getIDTransaction().getIdRestaurant() == idRestaurant && transaction.getIDTransaction().getIdSupplier() == idSupplier && transaction.getIDTransaction().getIdProduct() == idProduct && transaction.getIsConfirmedRestaurant() == null) {
                transactionRepository.delete(transaction);
                result[0] = "transactionDeleteProduct";
                return result;
            }
        }

        result[0] = "Error: transactionDeleteProduct";
        return result;
    }

    @RequestMapping(value = "/products/transactionDeleteTransaction", method = RequestMethod.POST)
    public String[] transactionDeleteTransaction(HttpSession session, @RequestParam("idTransaction") String transactionId, @RequestParam("idSupplier") String supplierId) {
        
        if(session.getAttribute("user") != "restaurant") {
            result[0] = "Error: transactionDeleteTransaction";
            return result;
        }

        Long idTransaction = Long.parseLong(transactionId);
        Long idRestaurant = restaurantRepository.findByUsername(session.getAttribute("username").toString()).getId();
        Long idSupplier = Long.parseLong(supplierId);

        for (Transaction transaction : transactionRepository.findAll()) {
            if(transaction.getIDTransaction().getIdTransaction() == idTransaction && transaction.getIDTransaction().getIdRestaurant() == idRestaurant && transaction.getIDTransaction().getIdSupplier() == idSupplier && transaction.getIsConfirmedRestaurant() == null) {
                transactionRepository.delete(transaction);
            }
        }

        result[0] = "transactionDeleteTransaction";
        return result;
    }

    @RequestMapping(value = "/products/transactionSuccessTransaction", method = RequestMethod.POST)
    public String[] transactionSuccessTransaction(HttpSession session, @RequestParam("idTransaction") String transactionId, @RequestParam("id") String id) {

        Long idTransaction = Long.parseLong(transactionId);
        Long idRestaurant;
        Long idSupplier;

        if(session.getAttribute("user") == "restaurant") {
            idRestaurant = restaurantRepository.findByUsername(session.getAttribute("username").toString()).getId();
            idSupplier = Long.parseLong(id);
            for (Transaction transaction : transactionRepository.findAll()) {
                if(transaction.getIDTransaction().getIdTransaction() == idTransaction && transaction.getIDTransaction().getIdRestaurant() == idRestaurant && transaction.getIDTransaction().getIdSupplier() == idSupplier && transaction.getIsConfirmedRestaurant() == null) {
                    transaction.setIsConfirmedRestaurant(true);
                    transactionRepository.save(transaction);
                }
            }
        } else if(session.getAttribute("user") == "supplier") {
            idRestaurant = Long.parseLong(id);;
            idSupplier = supplierRepository.findByUsername(session.getAttribute("username").toString()).getId();
            for (Transaction transaction : transactionRepository.findAll()) {
                if(transaction.getIDTransaction().getIdTransaction() == idTransaction && transaction.getIDTransaction().getIdRestaurant() == idRestaurant && transaction.getIDTransaction().getIdSupplier() == idSupplier && transaction.getIsConfirmedRestaurant() == true && transaction.getIsConfirmedSupplier() == null) {
                    transaction.setIsConfirmedSupplier(true);
                    transactionRepository.save(transaction);
                    SuppliersProducts suppliersProducts = suppliersProductsRepository.findById(new IDSupplierProduct(idSupplier, transaction.getIDTransaction().getIdProduct())).get();
                    suppliersProducts.setQuantity(suppliersProducts.getQuantity() - transaction.getQuantity());
                    suppliersProductsRepository.save(suppliersProducts);
                }
            }
        }

        result[0] = "transactionSuccessTransaction";
        return result;
    }

    @RequestMapping(value = "/products/transactionDeclineTransaction", method = RequestMethod.POST)
    public String[] transactionDeclineTransaction(HttpSession session, @RequestParam("idTransaction") String transactionId, @RequestParam("idRestaurant") String restaurantId) {

        if(session.getAttribute("user") != "supplier") {
            result[0] = "Error: transactionDeclineTransaction";
            return result;
        }
        
        Long idTransaction = Long.parseLong(transactionId);
        Long idRestaurant = Long.parseLong(restaurantId);
        Long idSupplier = supplierRepository.findByUsername(session.getAttribute("username").toString()).getId();

        for (Transaction transaction : transactionRepository.findAll()) {
            if(transaction.getIDTransaction().getIdTransaction() == idTransaction && transaction.getIDTransaction().getIdRestaurant() == idRestaurant && transaction.getIDTransaction().getIdSupplier() == idSupplier && transaction.getIsConfirmedRestaurant() == true) {
                transaction.setIsConfirmedSupplier(false);
                transactionRepository.save(transaction);
            }
        }

        result[0] = "transactionDeclineTransaction";
        return result;
    }
    
    /* Other Methods */

    private boolean checkCost(String str) {
        if(!str.matches("^[0-9]{1,10}$")) {
            int index1 = str.indexOf(".");
            int index2 = str.indexOf(",");
            if (index1 == -1 && index2 == -1) {
                return false;
            }
            if ((index1 != -1 && index2 != -1)) {
                return false;
            }
            if (index1 != -1) {
                if (str.substring(index1 + 1, str.length()).indexOf(".") != -1 || !str.substring(index1 + 1, str.length()).matches("^[0-9]{1,2}$")) {
                    return false;
                }
            }
            if (index2 != -1) {
                if (str.substring(index2 + 1, str.length()).indexOf(",") != -1 || !str.substring(index2 + 1, str.length()).matches("^[0-9]{1,2}$")) {
                    return false;
                }
            }
        }
        return true;
    }

    private boolean checkIsInList(List<HashMap<String, Object>> list, Long idTransaction) {
        for (HashMap<String,Object> obj : list) {
            if(obj.get("idTransaction") == idTransaction) {
                return true;
            }
        }
        return false;
    }
}