package com.magicbus.scheduler;

import com.magicbus.service.OnboardingAgingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class OnboardingAgingScheduler {
    
    private final OnboardingAgingService agingService;
    
    /**
     * Scheduled job to calculate onboarding aging every 60 seconds
     * Runs every minute to update aging data
     */
    @Scheduled(fixedRate = 60000) // 60 seconds = 60000 milliseconds
    public void calculateOnboardingAging() {
        log.info("========================================");
        log.info("SCHEDULED JOB: Onboarding Aging Calculator Started");
        log.info("========================================");
        
        try {
            agingService.calculateAndUpdateAging();
            log.info("SCHEDULED JOB: Onboarding Aging Calculator Completed Successfully");
        } catch (Exception e) {
            log.error("SCHEDULED JOB: Error calculating onboarding aging", e);
        }
        
        log.info("========================================");
    }
    
    /**
     * Scheduled cleanup job - runs daily at 2 AM
     * Removes old dismissed notifications
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupOldNotifications() {
        log.info("SCHEDULED JOB: Starting notification cleanup");
        
        try {
            int deleted = agingService.cleanupOldNotifications();
            log.info("SCHEDULED JOB: Cleaned up {} old notifications", deleted);
        } catch (Exception e) {
            log.error("SCHEDULED JOB: Error cleaning up notifications", e);
        }
    }
}
