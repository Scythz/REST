package com.example.springboot.controllers;


import com.example.springboot.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.security.Principal;

@Controller
@RequestMapping("/user")
public class UserController {

    private final UserService us;
    @Autowired
    public UserController(UserService us) {
        this.us = us;
    }

    @GetMapping
    public String userPage(Principal principal, Model model) {
        model.addAttribute("auUser", us.loadUserByUsername(principal.getName()));
        return "user";
    }

}
