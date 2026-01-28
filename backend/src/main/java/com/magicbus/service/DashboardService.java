package com.magicbus.service;

import com.magicbus.dto.DashboardDTO;
import com.magicbus.dto.DashboardDTO.MonthlyOnboardingData;
import com.magicbus.dto.DashboardDTO.MonthlyWorkflowData;
import com.magicbus.entity.workflow.WorkflowStatus;
import com.magicbus.repository.CandidateRepository;
import com.magicbus.repository.workflow.CandidateWorkflowRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

    private final CandidateRepository candidateRepository;
    private final CandidateWorkflowRepository workflowRepository;

    public DashboardDTO getDashboardStats(int year) {
        // Get year-filtered summary stats
        Long totalCandidates = candidateRepository.countByYear(year);
        Long completedOnboarding = candidateRepository.countByOnboardingStatusAndYear("COMPLETED", year);
        Long incompleteOnboarding = candidateRepository.countByOnboardingStatusAndYear("INCOMPLETE", year);
        
        Long pendingScreening = workflowRepository.countByStatusAndYear(WorkflowStatus.PENDING_SCREENING, year);
        Long pendingOrientation = workflowRepository.countByStatusAndYear(WorkflowStatus.PENDING_ORIENTATION, year);
        Long pendingEnroll = workflowRepository.countByStatusAndYear(WorkflowStatus.PENDING_ENROLL, year);
        Long enrolled = workflowRepository.countByStatusAndYear(WorkflowStatus.ENROLLED, year);
        Long dropped = workflowRepository.countByStatusAndYear(WorkflowStatus.ON_HOLD, year); // ON_HOLD shown as Dropped
        
        // Get monthly onboarding data
        List<MonthlyOnboardingData> monthlyOnboarding = getMonthlyOnboardingData(year);
        
        // Get monthly workflow data
        List<MonthlyWorkflowData> monthlyWorkflow = getMonthlyWorkflowData(year);
        
        return DashboardDTO.builder()
                .totalCandidates(totalCandidates != null ? totalCandidates : 0L)
                .completedOnboarding(completedOnboarding != null ? completedOnboarding : 0L)
                .incompleteOnboarding(incompleteOnboarding != null ? incompleteOnboarding : 0L)
                .pendingScreening(pendingScreening != null ? pendingScreening : 0L)
                .pendingOrientation(pendingOrientation != null ? pendingOrientation : 0L)
                .pendingEnroll(pendingEnroll != null ? pendingEnroll : 0L)
                .enrolled(enrolled != null ? enrolled : 0L)
                .dropped(dropped != null ? dropped : 0L)
                .monthlyOnboardingData(monthlyOnboarding)
                .monthlyWorkflowData(monthlyWorkflow)
                .build();
    }

    public DashboardDTO getDashboardSummary() {
        Long totalCandidates = candidateRepository.count();
        Long completedOnboarding = candidateRepository.countByOnboardingStatus("COMPLETED");
        Long incompleteOnboarding = candidateRepository.countByOnboardingStatus("INCOMPLETE");
        
        Long pendingScreening = workflowRepository.countByStatus(WorkflowStatus.PENDING_SCREENING);
        Long pendingOrientation = workflowRepository.countByStatus(WorkflowStatus.PENDING_ORIENTATION);
        Long pendingEnroll = workflowRepository.countByStatus(WorkflowStatus.PENDING_ENROLL);
        Long enrolled = workflowRepository.countByStatus(WorkflowStatus.ENROLLED);
        Long dropped = workflowRepository.countByStatus(WorkflowStatus.ON_HOLD); // ON_HOLD shown as Dropped
        
        return DashboardDTO.builder()
                .totalCandidates(totalCandidates)
                .completedOnboarding(completedOnboarding)
                .incompleteOnboarding(incompleteOnboarding)
                .pendingScreening(pendingScreening != null ? pendingScreening : 0L)
                .pendingOrientation(pendingOrientation != null ? pendingOrientation : 0L)
                .pendingEnroll(pendingEnroll != null ? pendingEnroll : 0L)
                .enrolled(enrolled != null ? enrolled : 0L)
                .dropped(dropped != null ? dropped : 0L)
                .build();
    }

    private List<MonthlyOnboardingData> getMonthlyOnboardingData(int year) {
        List<MonthlyOnboardingData> monthlyData = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            Long completed = candidateRepository.countByOnboardingStatusAndMonth("COMPLETED", year, month);
            Long incomplete = candidateRepository.countByOnboardingStatusAndMonth("INCOMPLETE", year, month);
            
            monthlyData.add(MonthlyOnboardingData.builder()
                    .month(month)
                    .monthName(Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                    .completed(completed != null ? completed : 0L)
                    .incomplete(incomplete != null ? incomplete : 0L)
                    .total((completed != null ? completed : 0L) + (incomplete != null ? incomplete : 0L))
                    .build());
        }
        
        return monthlyData;
    }

    private List<MonthlyWorkflowData> getMonthlyWorkflowData(int year) {
        List<MonthlyWorkflowData> monthlyData = new ArrayList<>();
        
        for (int month = 1; month <= 12; month++) {
            Long pendingScreening = workflowRepository.countByStatusAndMonth(WorkflowStatus.PENDING_SCREENING, year, month);
            Long pendingOrientation = workflowRepository.countByStatusAndMonth(WorkflowStatus.PENDING_ORIENTATION, year, month);
            Long pendingEnroll = workflowRepository.countByStatusAndMonth(WorkflowStatus.PENDING_ENROLL, year, month);
            Long enrolled = workflowRepository.countByStatusAndMonth(WorkflowStatus.ENROLLED, year, month);
            Long dropped = workflowRepository.countByStatusAndMonth(WorkflowStatus.ON_HOLD, year, month); // ON_HOLD shown as Dropped
            
            Long total = (pendingScreening != null ? pendingScreening : 0L) +
                        (pendingOrientation != null ? pendingOrientation : 0L) +
                        (pendingEnroll != null ? pendingEnroll : 0L) +
                        (enrolled != null ? enrolled : 0L) +
                        (dropped != null ? dropped : 0L);
            
            monthlyData.add(MonthlyWorkflowData.builder()
                    .month(month)
                    .monthName(Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH))
                    .pendingScreening(pendingScreening != null ? pendingScreening : 0L)
                    .pendingOrientation(pendingOrientation != null ? pendingOrientation : 0L)
                    .pendingEnroll(pendingEnroll != null ? pendingEnroll : 0L)
                    .enrolled(enrolled != null ? enrolled : 0L)
                    .dropped(dropped != null ? dropped : 0L)
                    .total(total)
                    .build());
        }
        
        return monthlyData;
    }
}
