package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_languages", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"candidate_id", "language_name"})
}, indexes = {
    @Index(name = "idx_candidate_languages_candidate", columnList = "candidate_id")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateLanguage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    @Column(nullable = false, length = 100)
    private String languageName;
    
    @Column(length = 50)
    private String proficiencyLevel;  // BASIC, INTERMEDIATE, FLUENT, NATIVE
    
    @Column(nullable = true, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
