package com.example.demo.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Stores OTPs in memory with a 10-minute TTL.
 * Keyed by email (lowercase).
 */
@Service
public class OtpService {

    private static final long TTL_SECONDS   = 10 * 60; // 10 minutes

    private final SecureRandom random = new SecureRandom();

    private record OtpEntry(String otp, Instant expiresAt) {}

    private final ConcurrentHashMap<String, OtpEntry> store = new ConcurrentHashMap<>();

    /** Generate a random numeric OTP, store it, and return it. */
    public String generateAndStore(String email) {
        // Zero-padded 6-digit OTP
        int raw = random.nextInt(1_000_000);
        String otp = String.format("%06d", raw);
        store.put(email.toLowerCase(),
                new OtpEntry(otp, Instant.now().plusSeconds(TTL_SECONDS)));
        return otp;
    }

    /** Returns true if the OTP is valid and not expired, then removes it. */
    public boolean verify(String email, String otp) {
        OtpEntry entry = store.get(email.toLowerCase());
        if (entry == null)                          return false;
        if (Instant.now().isAfter(entry.expiresAt())) {
            store.remove(email.toLowerCase());
            return false;
        }
        if (!entry.otp().equals(otp))               return false;
        store.remove(email.toLowerCase());           // single-use
        return true;
    }

    /** Check if a valid (unexpired) OTP exists for this email without consuming it. */
    public boolean hasValidOtp(String email) {
        OtpEntry entry = store.get(email.toLowerCase());
        if (entry == null) return false;
        if (Instant.now().isAfter(entry.expiresAt())) {
            store.remove(email.toLowerCase());
            return false;
        }
        return true;
    }
}
