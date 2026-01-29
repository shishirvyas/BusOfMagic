package com.magicbus.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingAgingNotificationDTO {
    private Long id;
    private Long candidateId;
    private String candidateName;
    private String phoneNumber;
    private String onboardingStatus;
    private Integer daysSinceCreated;
    private String agingLevel;
    private String agingColor;
    private String message;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
