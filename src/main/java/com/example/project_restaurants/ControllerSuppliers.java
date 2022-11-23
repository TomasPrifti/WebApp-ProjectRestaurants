package com.example.project_restaurants;

import java.security.SecureRandom;
import java.util.*;

import javax.servlet.http.HttpSession;

import com.example.project_restaurants.Models.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
public class ControllerSuppliers {

    @Autowired
    private SupplierRepository supplierRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private SuppliersProductsRepository suppliersProductsRepository;

    private int strength = 10;
    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(strength, new SecureRandom());

    private String[] result = new String[1];

    @RequestMapping(value = "/suppliers/addSuppliers", method = RequestMethod.GET)
    public List<HashMap<String, Object>> addSuppliers(HttpSession session) {

        List<HashMap<String, Object>> list = new ArrayList<HashMap<String, Object>>();
        HashMap<String, Object> obj;
        List<Supplier> listSuppliers = new ArrayList<Supplier>();
        Supplier supplier;
        List<SuppliersProducts> listSuppliersProducts = new ArrayList<SuppliersProducts>();
        List<HashMap<String, Object>> listProductsToReturn;
        HashMap<String, Object> productToReturn;

        listSuppliers = supplierRepository.findAll();
        listSuppliersProducts = suppliersProductsRepository.findAll();

        for (int i = 0; i < listSuppliers.size(); i++) {

            supplier = listSuppliers.get(i);
            if (supplier.getName() == null || supplier.getName().equals("")) {
                listSuppliers.remove(supplier);
                i--;
                continue;
            }
            obj = new HashMap<String, Object>();
            obj.put("name", supplier.getName());
            if (supplier.getAddress() == null || supplier.getAddress().equals("")) {
                obj.put("address", "Non disponibile");
            } else {
                obj.put("address", supplier.getAddress());
            }
            if(session.getAttribute("user") != null) {
                listProductsToReturn = new ArrayList<HashMap<String, Object>>();
                obj.put("products", listProductsToReturn);
                for (int j = 0; j < listSuppliersProducts.size(); j++) {
                    if (listSuppliersProducts.get(j).getIdSupplierProduct().getIdSupplier() == supplier.getId()) {
                        productToReturn = new HashMap<String, Object>();
                        productToReturn.put("name", productRepository.getById(listSuppliersProducts.get(j).getIdSupplierProduct().getIdProduct()).getName());
                        productToReturn.put("quantity", listSuppliersProducts.get(j).getQuantity());
                        productToReturn.put("cost", listSuppliersProducts.get(j).getCost());
                        listProductsToReturn.add(productToReturn);
                    }
                }
            }
            list.add(obj);
        }

        return list;

        /* List Returned
            {
                [0] = {
                        "name" : "...",
                        "address" : "...",
                        "products" : {
                            [0] = {
                                "name" = "...",
                                "quantity" = ...,
                                "cost" = ...
                            },
                            [1] = ........
                        }
                    },
                [1] = ........
            }
        */
    }

    @RequestMapping(value = "/suppliers/register", method = RequestMethod.POST)
    public String[] register(@ModelAttribute Supplier supplier, @RequestParam("confirm_password") String confirmPassword, HttpSession session) {

        String encodedPassword = bCryptPasswordEncoder.encode(supplier.getPassword());

        if (supplierRepository.findByUsername(supplier.getUsername()) != null) {
            result[0] = "error_register_username_exists";
            return result;
        }
        if (supplier.getPassword().compareTo(confirmPassword) != 0) {
            result[0] = "error_register_password";
            return result;
        }
        if (!supplier.getUsername().matches("^[a-zA-Z0-9à-ù_]{1,15}$")) {
            result[0] = "error_register_username";
            return result;
        }
        if (!supplier.getPassword()
                .matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()*+,.-:;<=>?@{}ç£_§€]).{8,15}$")) {
            result[0] = "error_register_password";
            return result;
        }
        if (!supplier.getEmail().matches("[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}")) {
            result[0] = "error_register_email";
            return result;
        }
        supplier.setPassword(encodedPassword);
        supplierRepository.save(supplier);
        session.setAttribute("user", "supplier");
        session.setAttribute("username", supplier.getUsername());
        setSession(session, supplier.getName(), supplier.getAddress());

        result[0] = "register";
        return result;

    }

    @RequestMapping(value = "/suppliers/login", method = RequestMethod.POST)
    public String[] login(@RequestParam("username") String username, @RequestParam("password") String password,
            HttpSession session) {

        Supplier supplier = supplierRepository.findByUsername(username);

        if (supplier == null) {
            result[0] = "error_login_username";
            return result;
        }
        if (!bCryptPasswordEncoder.matches(password, supplier.getPassword())) {
            result[0] = "error_login_password";
            return result;
        }
        session.setAttribute("user", "supplier");
        session.setAttribute("username", username);
        setSession(session, supplier.getName(), supplier.getAddress());

        result[0] = "login";
        return result;
    }

    @RequestMapping(value = "/suppliers/logout", method = RequestMethod.GET)
    public String[] logout(HttpSession session) {
        session.invalidate();
        result[0] = "logout";
        return result;
    }

    @RequestMapping(value = "/suppliers/deleteProfile", method = RequestMethod.GET)
    public String[] deleteProfile(HttpSession session) {

        Supplier supplier = supplierRepository.findByUsername(session.getAttribute("username").toString());
        supplierRepository.delete(supplier);
        session.invalidate();

        result[0] = "delete";
        return result;
    }

    @RequestMapping(value = "/suppliers/update", method = RequestMethod.POST)
    public String[] update(@RequestParam("name") String name, @RequestParam("address") String address, HttpSession session) {

        Supplier supplier = supplierRepository.findByUsername(session.getAttribute("username").toString());

        supplier.setName(name);
        supplier.setAddress(address);
        supplierRepository.save(supplier);
        setSession(session, name, address);

        result[0] = "update";
        return result;
    }

    /* Other Methods */

    private void setSession(HttpSession session, String name, String address) {
        session.setAttribute("name", name);
        session.setAttribute("address", address);
    }

}
