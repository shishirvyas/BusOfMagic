package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "onboarding_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false, unique = true)
    private Candidate candidate;
    
    // Signup Step Status
    @Builder.Default
    private Boolean signupCompleted = false;
    private LocalDateTime signupCompletedAt;
    
    // Personal Details Step Status
    @Builder.Default
    private Boolean personalDetailsCompleted = false;
    private LocalDateTime personalDetailsCompletedAt;
    
    // Education Details Step Status
    @Builder.Default
    private Boolean educationDetailsCompleted = false;
    private LocalDateTime educationDetailsCompletedAt;
    
    // Skills Step Status
    @Builder.Default
    private Boolean skillsCompleted = false;
    private LocalDateTime skillsCompletedAt;
    
    // Questions Step Status
    @Builder.Default
    private Boolean questionsCompleted = false;
    private LocalDateTime questionsCompletedAt;
    
    // Overall Status
    @Builder.Default
    private Boolean overallCompleted = false;
    private LocalDateTime overallCompletedAt;
    
    // Progress Tracking
    @Column(length = 50)
    private String currentStep;
    
    @Column(precision = 3, scale = 0)
    @Builder.Default
    private BigDecimal progressPercentage = BigDecimal.ZERO;
    
    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
