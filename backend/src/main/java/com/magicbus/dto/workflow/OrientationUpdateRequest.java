package com.magicbus.dto.workflow;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrientationUpdateRequest {
    private Long candidateWorkflowId;
    private String notes;
    private boolean completed; // true = move to PENDING_ENROLL
}
