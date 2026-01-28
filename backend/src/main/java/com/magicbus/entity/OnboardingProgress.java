package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "onboarding_progress", indexes = {
    @Index(name = "idx_onboarding_progress_candidate", columnList = "candidate_id"),
    @Index(name = "idx_onboarding_progress_overall", columnList = "overall_completed")
})
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
    @Column(nullable = false)
    @Builder.Default
    private Boolean signupCompleted = false;
    
    @Column
    private LocalDateTime signupCompletedAt;
    
    // Personal Details Step Status
    @Column(nullable = false)
    @Builder.Default
    private Boolean personalDetailsCompleted = false;
    
    @Column
    private LocalDateTime personalDetailsCompletedAt;
    
    // Education Details Step Status
    @Column(nullable = false)
    @Builder.Default
    private Boolean educationDetailsCompleted = false;
    
    @Column
    private LocalDateTime educationDetailsCompletedAt;
    
    // Skills Step Status
    @Column(nullable = false)
    @Builder.Default
    private Boolean skillsCompleted = false;
    
    @Column
    private LocalDateTime skillsCompletedAt;
    
    // Overall Status
    @Column(nullable = false)
    @Builder.Default
    private Boolean overallCompleted = false;
    
    @Column
    private LocalDateTime overallCompletedAt;
    
    // Progress Tracking
    @Column(length = 50)
    private String currentStep;
    
    @Column(precision = 3, scale = 0)
    @Builder.Default
    private Long progressPercentage = 0L;
    
    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
