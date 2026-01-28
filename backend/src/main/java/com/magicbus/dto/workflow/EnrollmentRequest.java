package com.magicbus.dto.workflow;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentRequest {
    private Long candidateWorkflowId;
    private Long trainingBatchId;
    private String notes;
}
