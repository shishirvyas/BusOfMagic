package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_skills", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"candidate_id", "skill_name"})
}, indexes = {
    @Index(name = "idx_candidate_skills_candidate", columnList = "candidate_id"),
    @Index(name = "idx_candidate_skills_skill_name", columnList = "skill_name")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateSkill {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    @Column(nullable = false, length = 100)
    private String skillName;
    
    @Column(length = 50)
    private String proficiencyLevel;  // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    
    @Column(precision = 3, scale = 1)
    private BigDecimal yearsOfExperience;
    
    @Column(nullable = true)
    private Boolean verified = false;
    
    @Column(nullable = true, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = true)
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
