package com.magicbus.dto.workflow;

import com.magicbus.entity.workflow.WorkflowStatus;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateWorkflowDTO {
    private Long id;
    private Long candidateId;
    
    // Candidate details
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String city;
    private String state;
    private String gender;
    
    // Scores
    private BigDecimal engagementScore;
    private BigDecimal dropoutRiskScore;
    
    // Workflow status
    private WorkflowStatus status;
    private String statusDisplayName;
    
    // Screening info
    private LocalDateTime screeningCompletedAt;
    private String screeningCompletedByName;
    private String screeningNotes;
    
    // Orientation info
    private LocalDateTime orientationCompletedAt;
    private String orientationCompletedByName;
    private String orientationNotes;
    
    // Enrollment info
    private LocalDateTime enrolledAt;
    private String enrolledByName;
    private Long trainingBatchId;
    private String trainingBatchCode;
    private String trainingName;
    private String enrollmentNotes;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
