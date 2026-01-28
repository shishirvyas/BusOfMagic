package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_opening", indexes = {
    @Index(name = "idx_job_opening_status", columnList = "status"),
    @Index(name = "idx_job_opening_closing_date", columnList = "closing_date")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobOpening {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    private Employer employer;
    
    // Job Details
    @Column(length = 255, nullable = false)
    private String jobTitle;
    
    @Column(columnDefinition = "TEXT")
    private String jobDescription;
    
    @Column(length = 50)
    private String jobType;  // FULL_TIME, PART_TIME, INTERNSHIP, CONTRACT
    
    // Requirements
    @Column(columnDefinition = "TEXT")
    private String requiredSkills;  // JSON array
    
    @Column(columnDefinition = "TEXT")
    private String requiredQualifications;  // JSON array
    
    @Column(name = "minimum_experience_years", precision = 3, scale = 1)
    private BigDecimal minimumExperienceYears = BigDecimal.ZERO;
    
    @Column(name = "preferred_education", length = 100)
    private String preferredEducation;
    
    // Compensation
    @Column(name = "salary_range_min", precision = 10, scale = 2)
    private BigDecimal salaryRangeMin;
    
    @Column(name = "salary_range_max", precision = 10, scale = 2)
    private BigDecimal salaryRangeMax;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal ctc;
    
    // Location
    @Column(name = "job_location", length = 255)
    private String jobLocation;
    
    @Column(name = "is_remote")
    private Boolean isRemote = false;
    
    // Opening Status
    @Column(name = "number_of_positions")
    private Integer numberOfPositions = 1;
    
    @Column(name = "positions_filled")
    private Integer positionsFilled = 0;
    
    @Column(length = 50)
    private String status = "OPEN";  // OPEN, FILLED, CLOSED, ON_HOLD
    
    @Column(name = "posted_date")
    private LocalDate postedDate = LocalDate.now();
    
    @Column(name = "closing_date")
    private LocalDate closingDate;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();
}
