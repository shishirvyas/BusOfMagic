package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verification", indexes = {
    @Index(name = "idx_otp_verification_contact", columnList = "contact"),
    @Index(name = "idx_otp_verification_expires", columnList = "expires_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String contact;  // Email or Phone Number
    
    @Column(nullable = false, length = 20)
    private String contactType;  // EMAIL or PHONE
    
    @Column(nullable = false, length = 6)
    private String otpCode;
    
    @Column(nullable = false)
    private Boolean isVerified = false;
    
    @Column(nullable = false)
    private Integer attempts = 0;
    
    @Column(nullable = false)
    private Integer maxAttempts = 5;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    
    @Column
    private LocalDateTime verifiedAt;
}
