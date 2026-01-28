package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_answer", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"candidate_id", "question_id"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateAnswer {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private OnboardingQuestion question;
    
    @Column(columnDefinition = "TEXT")
    private String answerText;
    
    @Column(columnDefinition = "TEXT")
    private String answerArray;
    
    private Integer ratingScore;
    
    @Column(precision = 3, scale = 2)
    private BigDecimal answerConfidence;
    
    @Builder.Default
    private Boolean isPartiallyAnswered = false;
    
    @Builder.Default
    private Boolean isSubmitted = true;
    
    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime answeredAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
