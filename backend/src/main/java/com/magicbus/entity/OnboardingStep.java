package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "onboarding_step")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingStep {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 100, nullable = false)
    private String stepName;
    
    @Column(nullable = false)
    private Integer stepOrder;
    
    @Column(length = 50, nullable = false, unique = true)
    private String stepKey;  // PERSONAL_INFO, EDUCATION, SKILLS, ASSESSMENT, PROFILE_VERIFICATION, ORIENTATION
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(length = 50)
    private String category;  // DATA_COLLECTION, ASSESSMENT, VERIFICATION, ORIENTATION, PLACEMENT
    
    @Column(name = "is_mandatory")
    private Boolean isMandatory = true;
    
    @Column(name = "estimated_duration_days")
    private Integer estimatedDurationDays;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
