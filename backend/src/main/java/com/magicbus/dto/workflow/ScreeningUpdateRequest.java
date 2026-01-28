package com.magicbus.dto.workflow;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScreeningUpdateRequest {
    private Long candidateWorkflowId;
    private String notes;
    private boolean approved; // true = move to PENDING_ORIENTATION, false = put ON_HOLD
}
