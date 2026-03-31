package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import com.example.demo.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserRepository userRepo;
    private final EmailService emailService;
    private final OtpService otpService;

    public AuthController(UserRepository userRepo,
                          EmailService emailService,
                          OtpService otpService) {
        this.userRepo     = userRepo;
        this.emailService = emailService;
        this.otpService   = otpService;
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

    // ================= OAUTH2 USER FETCH =================
    // Called by frontend after Google OAuth redirect.
    // No password check — Google already authenticated the user.
    @GetMapping("/oauth-user")
    public User getOAuthUser(@RequestParam String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ================= FORGOT PASSWORD – STEP 1 =================
    // Send 6-digit OTP to the given email (if account exists).
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        if (userRepo.findByEmail(email).isEmpty()) {
            // Return 200 even for unknown emails to avoid user enumeration
            return ResponseEntity.ok("If this email is registered, an OTP has been sent.");
        }
        String otp = otpService.generateAndStore(email);
        emailService.sendOtpEmail(email, otp);
        return ResponseEntity.ok("OTP sent successfully.");
    }

    // ================= FORGOT PASSWORD – STEP 2 =================
    // Verify the OTP without consuming it (frontend uses this to
    // advance to 'set new password' step).
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestParam String email,
            @RequestParam String otp) {
        // Peek without consuming — reset-password will do the final consume
        if (!otpService.hasValidOtp(email)) {
            return ResponseEntity.badRequest().body("OTP has expired or does not exist.");
        }
        // Now actually verify (and consume) to confirm the code is correct
        if (!otpService.verify(email, otp)) {
            return ResponseEntity.badRequest().body("Incorrect OTP. Please try again.");
        }
        return ResponseEntity.ok("OTP verified.");
    }

    // ================= FORGOT PASSWORD – STEP 3 =================
    // Called after OTP is verified — update the user's password.
    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestParam String email,
            @RequestParam String newPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(newPassword);
        userRepo.save(user);
        return ResponseEntity.ok("Password updated successfully.");
    }
}