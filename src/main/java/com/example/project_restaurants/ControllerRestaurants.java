package com.example.project_restaurants;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.util.*;

import javax.servlet.http.HttpSession;

import com.example.project_restaurants.Models.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class ControllerRestaurants {

    @Autowired
    private RestaurantRepository restaurantRepository;

    private int strength = 10;
    BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder(strength, new SecureRandom());

    private String[] result = new String[1];
    private String PATH = "src/main/resources/static/images/restaurants/";
    private String PATH_IMAGES = "images/restaurants/";
    private String PATH_FILE_NOT_FOUND = PATH_IMAGES + "NotFound.jpg";
    private File file;

    @RequestMapping(value = "/restaurants/addRestaurants", method = RequestMethod.GET)
    public List<Restaurant> addRestaurants() {

        List<Restaurant> listRestaurants = new ArrayList<Restaurant>();
        Restaurant restaurant;

        listRestaurants = restaurantRepository.findAll();

        for (int i = 0; i < listRestaurants.size(); i++) {
            restaurant = listRestaurants.get(i);
            if (restaurant.getName() == null || restaurant.getName().equals("")) {
                listRestaurants.remove(restaurant);
                i--;
                continue;
            }
            if (restaurant.getImage() == null) {
                restaurant.setImage(" ");
            }
            file = new File(PATH + restaurant.getImage());
            if (file.isFile()) {
                restaurant.setImage(PATH_IMAGES + restaurant.getImage());
            } else {
                restaurant.setImage(PATH_FILE_NOT_FOUND);
            }
            restaurant.setUsername(null);
            restaurant.setPassword(null);
            restaurant.setEmail(null);
            restaurant.setId(null);
        }

        return listRestaurants;
    }

    @RequestMapping(value = "/restaurants/register", method = RequestMethod.POST)
    public String[] register(@ModelAttribute Restaurant restaurant, @RequestParam("confirm_password") String confirmPassword, HttpSession session) {

        String encodedPassword = bCryptPasswordEncoder.encode(restaurant.getPassword());

        if(restaurantRepository.findByUsername(restaurant.getUsername()) != null) {
            result[0] = "error_register_username_exists";
            return result;
        }
        if (restaurant.getPassword().compareTo(confirmPassword) != 0) {
            result[0] = "error_register_password";
            return result;
        }
        if(!restaurant.getUsername().matches("^[a-zA-Z0-9à-ù_]{1,15}$")) {
            result[0] = "error_register_username";
            return result;
        }
        if(!restaurant.getPassword().matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!#$%&()*+,.-:;<=>?@{}ç£_§€]).{8,15}$")) {
            result[0] = "error_register_password";
            return result;
        }
        if(!restaurant.getEmail().matches("[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}")) {
            result[0] = "error_register_email";
            return result;
        }
        restaurant.setPassword(encodedPassword);
        restaurantRepository.save(restaurant);
        session.setAttribute("user", "restaurant");
        session.setAttribute("username", restaurant.getUsername());
        setSession(session, restaurant.getName(), restaurant.getAddress(), restaurant.getDescription());

        result[0] = "register";
        return result;
    }

    @RequestMapping(value = "/restaurants/login", method = RequestMethod.POST)
    public String[] login(@RequestParam("username") String username, @RequestParam("password") String password, HttpSession session) {

        Restaurant restaurant = restaurantRepository.findByUsername(username);

        if(restaurant == null) {
            result[0] = "error_login_username";
            return result;
        }
        if(!bCryptPasswordEncoder.matches(password, restaurant.getPassword())) {
            result[0] = "error_login_password";
            return result;
        }
        session.setAttribute("user", "restaurant");
        session.setAttribute("username", username);
        setSession(session, restaurant.getName(), restaurant.getAddress(), restaurant.getDescription());

        result[0] = "login";
        return result;
    }


    @RequestMapping(value = "/restaurants/logout", method = RequestMethod.GET)
    public String[] logout(HttpSession session) { 
        session.invalidate();
        result[0] = "logout";
        return result; 
    }

    @RequestMapping(value = "/restaurants/deleteProfile", method = RequestMethod.GET)
    public String[] deleteProfile(HttpSession session) {
        
        Restaurant restaurant = restaurantRepository.findByUsername(session.getAttribute("username").toString());
        file = new File(PATH + restaurant.getImage());

        if(restaurant.getImage() != null && file.isFile()) {
            file.delete();
        }
        restaurantRepository.delete(restaurant);
        session.invalidate();

        result[0] = "delete";
        return result;
    }

    @RequestMapping(value = "/restaurants/update", method = RequestMethod.POST)
    public String[] update (@RequestParam("name") String name, @RequestParam("address") String address, @RequestParam("description") String description, @RequestParam(value = "image", required = false) MultipartFile newFile, HttpSession session) throws IOException, InterruptedException {
        
        Restaurant restaurant = restaurantRepository.findByUsername(session.getAttribute("username").toString());

        if(newFile != null) {
            file = new File(PATH + restaurant.getImage());
            if(file.isFile()) {
                file.delete();
            }
            String ext = newFile.getOriginalFilename().split("\\.(?=[^\\.]+$)")[newFile.getOriginalFilename().split("\\.(?=[^\\.]+$)").length - 1];
            String newPath = "restaurants" + restaurant.getId().toString() + "." + ext;
            Files.copy(newFile.getInputStream(), Paths.get(PATH + newPath));
            Thread.sleep(500); //Wait for file to be stored
            restaurant.setImage(newPath);
        }
        restaurant.setName(name);
        restaurant.setAddress(address);
        restaurant.setDescription(description);
        restaurantRepository.save(restaurant);
        setSession(session, name, address, description);

        result[0] = "update";
        return result;
    }

    /* Other Methods */

    private void setSession(HttpSession session, String name, String address, String description) {
        session.setAttribute("name", name);
        session.setAttribute("address", address);
        session.setAttribute("description", description);
    }

}