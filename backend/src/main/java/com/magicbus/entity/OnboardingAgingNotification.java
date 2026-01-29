package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "onboarding_aging_notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingAgingNotification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "candidate_id", nullable = false)
    private Long candidateId;
    
    @Column(name = "candidate_name", length = 200, nullable = false)
    private String candidateName;
    
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    
    @Column(name = "onboarding_status", length = 50, nullable = false)
    private String onboardingStatus;
    
    @Column(name = "days_since_created", nullable = false)
    private Integer daysSinceCreated;
    
    // GREEN = 1 day, AMBER = 3 days, RED = 5+ days
    @Column(name = "aging_level", length = 20, nullable = false)
    private String agingLevel;
    
    @Column(name = "aging_color", length = 20, nullable = false)
    private String agingColor;
    
    @Column(name = "message", length = 500)
    private String message;
    
    @Column(name = "is_read")
    @Builder.Default
    private Boolean isRead = false;
    
    @Column(name = "is_dismissed")
    @Builder.Default
    private Boolean isDismissed = false;
    
    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
