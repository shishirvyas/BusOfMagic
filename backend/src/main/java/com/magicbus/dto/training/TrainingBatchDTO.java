package com.magicbus.dto.training;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingBatchDTO {
    private Long id;
    private Long trainingId;
    private String trainingName;
    private String skillCategory;
    private String batchCode;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maxCapacity;
    private Integer currentEnrolled;
    private Integer availableSlots;
    private String location;
    private String trainerName;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
