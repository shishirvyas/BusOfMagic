package com.magicbus.dto.training;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingMasterDTO {
    private Long id;
    private String name;
    private String description;
    private String skillCategory;
    private Integer durationDays;
    private Boolean isActive;
    private Integer totalBatches;
    private Integer activeBatches;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
