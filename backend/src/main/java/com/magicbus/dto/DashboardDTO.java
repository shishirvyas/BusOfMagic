package com.magicbus.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    
    // Summary stats
    private Long totalCandidates;
    private Long completedOnboarding;
    private Long incompleteOnboarding;
    private Long pendingScreening;
    private Long pendingOrientation;
    private Long pendingEnroll;
    private Long enrolled;
    private Long dropped;
    
    // Monthly data for charts
    private List<MonthlyOnboardingData> monthlyOnboardingData;
    private List<MonthlyWorkflowData> monthlyWorkflowData;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyOnboardingData {
        private int month;
        private String monthName;
        private Long completed;
        private Long incomplete;
        private Long total;
    }
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyWorkflowData {
        private int month;
        private String monthName;
        private Long pendingScreening;
        private Long pendingOrientation;
        private Long pendingEnroll;
        private Long enrolled;
        private Long dropped;
        private Long total;
    }
}
