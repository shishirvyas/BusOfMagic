package com.magicbus.dto.training;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateTrainingRequest {
    private String name;
    private String description;
    private String skillCategory;
    private Integer durationDays;
}
