package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "candidate_mentor_mapping")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateMentorMapping {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    @ManyToOne
    @JoinColumn(name = "mentor_id", nullable = false)
    private Mentor mentor;
    
    @Column(name = "assignment_date", nullable = false)
    private LocalDateTime assignmentDate = LocalDateTime.now();
    
    @Column(name = "removal_date")
    private LocalDateTime removalDate;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @Column(name = "mentor_notes", columnDefinition = "TEXT")
    private String mentorNotes;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
