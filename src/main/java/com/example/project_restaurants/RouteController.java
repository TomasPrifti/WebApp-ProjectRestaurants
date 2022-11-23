package com.example.project_restaurants;

import javax.servlet.http.HttpSession;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

@RestController
public class RouteController {

    /* Home */
    @RequestMapping(value = { "/", "/home" })
    public ModelAndView home() {
        ModelAndView mv = new ModelAndView("home");
        return mv;
    }

    /* Restaurants */
    @RequestMapping("/restaurants")
    public ModelAndView restaurants(HttpSession session) {
        ModelAndView mv = new ModelAndView("restaurants");
        mv.addObject("user", session.getAttribute("user"));
        mv.addObject("username", session.getAttribute("username"));
        if(session.getAttribute("user") == "restaurant") {
            mv.addObject("name", session.getAttribute("name"));
            mv.addObject("address", session.getAttribute("address"));
            mv.addObject("description", session.getAttribute("description"));
        }
        return mv;
    }

    /* Suppliers */
    @RequestMapping("/suppliers")
    public ModelAndView suppliers(HttpSession session) {
        ModelAndView mv = new ModelAndView("suppliers");
        mv.addObject("user", session.getAttribute("user"));
        mv.addObject("username", session.getAttribute("username"));
        if(session.getAttribute("user") == "supplier") {
            mv.addObject("name", session.getAttribute("name"));
            mv.addObject("address", session.getAttribute("address"));
        }
        return mv;
    }

    /* Products */
    @RequestMapping("/products")
    public ModelAndView products(HttpSession session) {
        ModelAndView mv = new ModelAndView("products");
        mv.addObject("user", session.getAttribute("user"));
        mv.addObject("username", session.getAttribute("username"));
        return mv;
    }

    @RequestMapping("favicon.ico")
    public void returnNoFavicon() {

    }
}
