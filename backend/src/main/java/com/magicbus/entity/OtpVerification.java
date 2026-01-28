package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verification")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpVerification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String contact;
    
    @Column(nullable = false, length = 20)
    private String contactType;
    
    @Column(nullable = false, length = 6)
    private String otpCode;
    
    @Builder.Default
    private Boolean isVerified = false;
    
    @Builder.Default
    private Integer attempts = 0;
    
    @Builder.Default
    private Integer maxAttempts = 5;
    
    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(nullable = false)
    private LocalDateTime expiresAt;
    
    private LocalDateTime verifiedAt;
}
