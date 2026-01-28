package com.magicbus.dto;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillDto {
    private Long candidateId;
    private String skillName;
    private String proficiencyLevel;  // BEGINNER, INTERMEDIATE, ADVANCED, EXPERT
    private Double yearsOfExperience;
}
