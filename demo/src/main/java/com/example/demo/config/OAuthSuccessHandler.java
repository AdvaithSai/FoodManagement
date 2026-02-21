package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class OAuthSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepo;
    private final EmailService emailService;

    public OAuthSuccessHandler(UserRepository userRepo,
                               EmailService emailService) {
        this.userRepo = userRepo;
        this.emailService = emailService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication)
            throws IOException, ServletException {

        OAuth2User oauthUser =
                (OAuth2User) authentication.getPrincipal();

        String email = oauthUser.getAttribute("email");
        String name = oauthUser.getAttribute("name");

        User user = userRepo.findByEmail(email).orElse(null);

        // If user does NOT exist → register automatically
        if (user == null) {

            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword("GOOGLE_USER"); // dummy password
            user.setRole("CUSTOMER");
            user.setCreatedAt(LocalDateTime.now());

            userRepo.save(user);

            // Send welcome email
            emailService.sendWelcomeEmail(email, name);
        }

        // Redirect back to frontend
        response.sendRedirect(
                "http://localhost:3000/oauth-success?email=" + email
        );
    }
}