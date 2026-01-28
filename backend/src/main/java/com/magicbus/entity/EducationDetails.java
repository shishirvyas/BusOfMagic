package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "education_details")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne
    @JoinColumn(name = "candidate_id", nullable = false)
    private Candidate candidate;
    
    // 10th Standard
    @Column(length = 100)
    private String tenthBoard;
    
    @Column(name = "tenth_year_of_passing")
    private Integer tenthYearOfPassing;
    
    @Column(name = "tenth_percentage", precision = 5, scale = 2)
    private BigDecimal tenthPercentage;
    
    @Column(name = "tenth_marks_obtained", precision = 5, scale = 2)
    private BigDecimal tenthMarksObtained;
    
    @Column(name = "tenth_marks_total", precision = 5, scale = 2)
    private BigDecimal tenthMarksTotal;
    
    @Column(name = "tenth_stream", length = 50)
    private String tenthStream;  // SCIENCE, COMMERCE, ARTS
    
    @Column(name = "tenth_school_name", length = 255)
    private String tenthSchoolName;
    
    @Column(name = "tenth_school_location", length = 255)
    private String tenthSchoolLocation;
    
    // 12th Standard
    @Column(length = 100)
    private String twelfthBoard;
    
    @Column(name = "twelfth_year_of_passing")
    private Integer twelfthYearOfPassing;
    
    @Column(name = "twelfth_percentage", precision = 5, scale = 2)
    private BigDecimal twelfthPercentage;
    
    @Column(name = "twelfth_marks_obtained", precision = 5, scale = 2)
    private BigDecimal twelfthMarksObtained;
    
    @Column(name = "twelfth_marks_total", precision = 5, scale = 2)
    private BigDecimal twelfthMarksTotal;
    
    @Column(name = "twelfth_stream", length = 50)
    private String twelfthStream;
    
    @Column(name = "twelfth_college_name", length = 255)
    private String twelfthCollegeName;
    
    @Column(name = "twelfth_college_location", length = 255)
    private String twelfthCollegeLocation;
    
    // Higher Education
    @Column(name = "graduation_degree", length = 100)
    private String graduationDegree;
    
    @Column(name = "graduation_specialization", length = 100)
    private String graduationSpecialization;
    
    @Column(name = "graduation_year")
    private Integer graduationYear;
    
    @Column(name = "graduation_percentage", precision = 5, scale = 2)
    private BigDecimal graduationPercentage;
    
    @Column(name = "graduation_university", length = 255)
    private String graduationUniversity;
    
    @Column(name = "graduation_status", length = 50)
    private String graduationStatus;  // PURSUING, COMPLETED, DROPPED
    
    // Post-Graduation
    @Column(name = "post_graduation_degree", length = 100)
    private String postGraduationDegree;
    
    @Column(name = "post_graduation_year")
    private Integer postGraduationYear;
    
    @Column(name = "post_graduation_percentage", precision = 5, scale = 2)
    private BigDecimal postGraduationPercentage;
    
    // Skills & Certifications
    @Column(columnDefinition = "TEXT")
    private String certifications;  // JSON array
    
    @Column(length = 500)
    private String languagesKnown;  // JSON array
    
    // AI Fields
    @Column(name = "education_level_score", precision = 5, scale = 2)
    private BigDecimal educationLevelScore;
    
    @Column(name = "estimated_learning_capacity", length = 50)
    private String estimatedLearningCapacity;  // LOW, MEDIUM, HIGH
    
    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
