package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "skill_assessment", indexes = {
    @Index(name = "idx_skill_assessment_skill", columnList = "skill_name"),
    @Index(name = "idx_skill_assessment_score", columnList = "skill_score"),
    @Index(name = "idx_skill_assessment_candidate_score", columnList = "candidate_id, skill_score")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillAssessment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    // Assessment Details
    @Column(length = 100, nullable = false)
    private String skillName;
    
    @Column(length = 100)
    private String skillCategory;  // TECHNICAL, SOFT_SKILLS, BEHAVIORAL
    
    @Column(length = 50)
    private String assessmentType;  // SELF_ASSESSMENT, EXPERT_EVALUATION, AUTOMATED_TEST, PRACTICAL
    
    // Scores
    @Column(name = "max_score")
    private Integer maxScore = 100;
    
    @Column(name = "obtained_score")
    private Integer obtainedScore;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal skillScore;  // Normalized 0-100
    
    @Column(name = "proficiency_level", length = 50)
    private String proficiencyLevel;  // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    
    // AI Analysis
    @Column(name = "skill_gap_analysis", columnDefinition = "TEXT")
    private String skillGapAnalysis;
    
    @Column(name = "improvement_suggestions", columnDefinition = "TEXT")
    private String improvementSuggestions;
    
    @Column(name = "learning_path_suggested", length = 500)
    private String learningPathSuggested;
    
    // Timestamps
    @Column(name = "assessment_date", nullable = false)
    private LocalDateTime assessmentDate = LocalDateTime.now();
    
    @Column(name = "next_assessment_date")
    private LocalDateTime nextAssessmentDate;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
    
    @Column(name = "assessed_by", length = 255)
    private String assessedBy;
}
