package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepo;
    private final EmailService emailService;

    public AuthController(UserRepository userRepo,
                          EmailService emailService) {
        this.userRepo = userRepo;
        this.emailService = emailService;
    }

    // ================= REGISTER =================

    @PostMapping("/register")
    public User register(@RequestBody User user) {

        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepo.save(user);

        // Send welcome email
        emailService.sendWelcomeEmail(
                savedUser.getEmail(),
                savedUser.getName()
        );

        return savedUser;
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public User login(@RequestBody User loginUser) {

        User user = userRepo.findByEmail(loginUser.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(loginUser.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}