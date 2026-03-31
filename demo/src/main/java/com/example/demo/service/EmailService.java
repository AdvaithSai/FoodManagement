package com.example.demo.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeEmail(String toEmail, String name) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🎉 Welcome to FoodExpress – Let’s Get Started!");

        message.setText(
                "Hi " + name + ",\n\n" +

                "Welcome to FoodExpress! 🍽️\n\n" +

                "We are absolutely thrilled to have you join our growing food community.\n\n" +

                "With FoodExpress, you can:\n" +
                "• Explore amazing restaurants near you\n" +
                "• Discover delicious dishes\n" +
                "• Track your orders in real-time\n" +
                "• Enjoy seamless and fast delivery\n\n" +

                "Whether you're craving spicy biryani, comfort food, or something new — we've got you covered!\n\n" +

                "Our mission is simple:\n" +
                "To connect great food with great people.\n\n" +

                "We hope you enjoy your journey with us.\n\n" +

                "If you have any questions, feel free to reach out to our support team anytime.\n\n" +

                "Happy Ordering! 🍕🍔🍜\n\n" +

                "Warm regards,\n" +
                "The FoodExpress Team\n" +
                "support@foodexpress.com"
        );

        mailSender.send(message);
    }

    public void sendOtpEmail(String toEmail, String otp) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("🔐 FoodExpress – Your Password Reset OTP");

        message.setText(
                "Hello,\n\n" +
                "We received a request to reset your FoodExpress account password.\n\n" +
                "Your One-Time Password (OTP) is:\n\n" +
                "  " + otp + "\n\n" +
                "This OTP is valid for 10 minutes. Do NOT share it with anyone.\n\n" +
                "If you did not request a password reset, please ignore this email — " +
                "your account remains safe.\n\n" +
                "Warm regards,\n" +
                "The FoodExpress Team"
        );

        mailSender.send(message);
    }
}
