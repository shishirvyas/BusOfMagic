package com.magicbus.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationDetailsDto {
    private Long candidateId;
    
    // ========== Frontend field names (simplified) ==========
    // These are the names used by the frontend form
    private String education10th;   // Maps to tenthBoard
    private String score10th;       // Maps to tenthPercentage (parsed to BigDecimal)
    private String education12th;   // Maps to twelfthBoard
    private String score12th;       // Maps to twelfthPercentage (parsed to BigDecimal)
    private String graduationDegree;
    private String graduationField; // Maps to graduationSpecialization
    private String graduationScore; // Maps to graduationPercentage (parsed to BigDecimal)
    
    // ========== Original detailed field names ==========
    // 10th Standard
    private String tenthBoard;
    private Integer tenthYearOfPassing;
    private BigDecimal tenthPercentage;
    private String tenthStream;
    private String tenthSchoolName;
    private String tenthSchoolLocation;
    
    // 12th Standard
    private String twelfthBoard;
    private Integer twelfthYearOfPassing;
    private BigDecimal twelfthPercentage;
    private String twelfthStream;
    private String twelfthCollegeName;
    private String twelfthCollegeLocation;
    
    // Graduation - detailed fields
    private String graduationSpecialization;
    private Integer graduationYear;
    private BigDecimal graduationPercentage;
    private String graduationUniversity;
    private String graduationStatus;
    
    // Post-Graduation
    private String postGraduationDegree;
    private Integer postGraduationYear;
    private BigDecimal postGraduationPercentage;
    private String postGraduationUniversity;
    private String postGraduationStatus;
    
    // Certifications
    private String certifications;  // JSON array
    private String additionalQualifications;
}
