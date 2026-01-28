package com.magicbus.dto.training;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainingCalendarDTO {
    private Long batchId;
    private String batchCode;
    private Long trainingId;
    private String trainingName;
    private String skillCategory;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer durationDays;
    private String location;
    private String trainerName;
    private Integer maxCapacity;
    private Integer currentEnrolled;
    private Integer availableSlots;
    private Boolean isActive;
    private List<EnrolledCandidateDTO> enrolledCandidates;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class EnrolledCandidateDTO {
        private Long candidateId;
        private String firstName;
        private String lastName;
        private String email;
        private String phoneNumber;
        private String city;
        private String state;
        private String gender;
        private LocalDate enrolledAt;
        private String enrolledByName;
    }
}
