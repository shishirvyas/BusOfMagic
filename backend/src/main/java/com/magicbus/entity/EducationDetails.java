package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
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
    
    private Integer tenthYearOfPassing;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal tenthPercentage;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal tenthMarksObtained;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal tenthMarksTotal;
    
    @Column(length = 50)
    private String tenthStream;
    
    @Column(length = 255)
    private String tenthSchoolName;
    
    @Column(length = 255)
    private String tenthSchoolLocation;
    
    // 12th Standard
    @Column(length = 100)
    private String twelfthBoard;
    
    private Integer twelfthYearOfPassing;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal twelfthPercentage;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal twelfthMarksObtained;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal twelfthMarksTotal;
    
    @Column(length = 50)
    private String twelfthStream;
    
    @Column(length = 255)
    private String twelfthCollegeName;
    
    @Column(length = 255)
    private String twelfthCollegeLocation;
    
    // Higher Education
    @Column(length = 100)
    private String graduationDegree;
    
    @Column(length = 100)
    private String graduationSpecialization;
    
    private Integer graduationYear;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal graduationPercentage;
    
    @Column(length = 255)
    private String graduationUniversity;
    
    @Column(length = 50)
    private String graduationStatus;
    
    // Post-Graduation
    @Column(length = 100)
    private String postGraduationDegree;
    
    private Integer postGraduationYear;
    
    @Column(precision = 5, scale = 2)
    private BigDecimal postGraduationPercentage;
    
    @Column(length = 255)
    private String postGraduationUniversity;
    
    @Column(length = 50)
    private String postGraduationStatus;
    
    // Certifications & Additional Qualifications
    @Column(columnDefinition = "TEXT")
    private String certifications;
    
    @Column(columnDefinition = "TEXT")
    private String additionalQualifications;
    
    // Timestamps
    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
