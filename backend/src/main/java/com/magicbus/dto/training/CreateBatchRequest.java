package com.magicbus.dto.training;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateBatchRequest {
    private Long trainingId;
    private String batchCode;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer maxCapacity;
    private String location;
    private String trainerName;
}
