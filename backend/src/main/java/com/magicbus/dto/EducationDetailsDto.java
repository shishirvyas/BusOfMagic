package com.magicbus.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EducationDetailsDto {
    private Long candidateId;
    
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
    
    // Graduation
    private String graduationDegree;
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
