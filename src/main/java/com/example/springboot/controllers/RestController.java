package com.example.springboot.controllers;

import com.example.springboot.models.Role;
import com.example.springboot.models.User;
import com.example.springboot.service.RoleService;
import com.example.springboot.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Set;

public class RestController {


    private final UserService userService;
    private final RoleService roleService;

    public RestController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("/api/user")
    public User getCurrentUser(Principal principal) {
        return (User) userService.loadUserByUsername(principal.getName());
    }

    @GetMapping("/api/admin/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/api/admin/roles")
    public Set<Role> getAllRoles() {
        return roleService.getRoles();
    }

    @GetMapping("/api/admin/users/{id}")
    public User getUser(@PathVariable int id) {
        return userService.getUserById(id);
    }

    @PostMapping("/api/admin/")
    public User saveUser(@ModelAttribute("user") User user,
                         @RequestParam(value = "selectedRoles", required = false) String[] roles) {
        return userService.saveUser(user, roles);
    }

    @DeleteMapping("/api/admin/{id}")
    public void deleteUser(@PathVariable("id") int id) {
        userService.delete(id);
    }

    @PutMapping("/api/admin/")
    public User editUser(@ModelAttribute User user,
                         @RequestParam(value = "selectedRoles", required = false) String[] roles) {
        return userService.saveUser(user, roles);
    }

}
