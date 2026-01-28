package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mentor")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mentor {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 100, nullable = false)
    private String firstName;
    
    @Column(length = 100, nullable = false)
    private String lastName;
    
    @Column(length = 255, nullable = false, unique = true)
    private String email;
    
    @Column(length = 20)
    private String phone;
    
    @Column(columnDefinition = "TEXT")
    private String specialization;  // JSON array
    
    @Column(name = "experience_years")
    private Integer experienceYears;
    
    @Column(name = "assigned_candidates_count")
    private Integer assignedCandidatesCount = 0;
    
    @Column(length = 50)
    private String status = "ACTIVE";  // ACTIVE, INACTIVE, ON_LEAVE
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
