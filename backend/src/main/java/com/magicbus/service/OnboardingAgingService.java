package com.magicbus.service;

import com.magicbus.entity.Candidate;
import com.magicbus.entity.OnboardingAgingNotification;
import com.magicbus.repository.CandidateRepository;
import com.magicbus.repository.OnboardingAgingNotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class OnboardingAgingService {
    
    private final CandidateRepository candidateRepository;
    private final OnboardingAgingNotificationRepository notificationRepository;
    
    // Aging thresholds
    private static final int GREEN_THRESHOLD = 1;  // 1 day - recently completed/started
    private static final int AMBER_THRESHOLD = 3;  // 3 days - needs attention
    private static final int RED_THRESHOLD = 5;    // 5+ days - critical
    
    /**
     * Calculate aging for all candidates and create/update notifications
     */
    @Transactional
    public void calculateAndUpdateAging() {
        log.info("=== Starting Onboarding Aging Calculation ===");
        
        List<Candidate> allCandidates = candidateRepository.findAll();
        
        int greenCount = 0;
        int amberCount = 0;
        int redCount = 0;
        int completedCount = 0;
        int incompleteCount = 0;
        
        for (Candidate candidate : allCandidates) {
            long daysSinceCreated = ChronoUnit.DAYS.between(candidate.getCreatedAt(), LocalDateTime.now());
            String onboardingStatus = candidate.getOnboardingStatus();
            
            // Determine aging level and color
            AgingInfo agingInfo = determineAgingLevel((int) daysSinceCreated, onboardingStatus);
            
            // Check if we need to create/update notification
            boolean exists = notificationRepository.existsByCandidateIdAndAgingLevelAndIsDismissedFalse(
                candidate.getId(), agingInfo.level);
            
            if (!exists) {
                // Create new notification
                OnboardingAgingNotification notification = OnboardingAgingNotification.builder()
                    .candidateId(candidate.getId())
                    .candidateName(candidate.getFirstName() + " " + candidate.getLastName())
                    .phoneNumber(candidate.getPhoneNumber())
                    .onboardingStatus(onboardingStatus)
                    .daysSinceCreated((int) daysSinceCreated)
                    .agingLevel(agingInfo.level)
                    .agingColor(agingInfo.color)
                    .message(agingInfo.message)
                    .isRead(false)
                    .isDismissed(false)
                    .build();
                
                notificationRepository.save(notification);
                
                log.info("Created notification for candidate {} (ID: {}) - Status: {}, Days: {}, Color: {}",
                    notification.getCandidateName(), 
                    candidate.getId(),
                    onboardingStatus, 
                    daysSinceCreated, 
                    agingInfo.color);
            }
            
            // Count statistics
            if ("COMPLETE".equalsIgnoreCase(onboardingStatus) || "COMPLETED".equalsIgnoreCase(onboardingStatus)) {
                completedCount++;
            } else {
                incompleteCount++;
            }
            
            switch (agingInfo.color) {
                case "GREEN" -> greenCount++;
                case "AMBER" -> amberCount++;
                case "RED" -> redCount++;
            }
        }
        
        log.info("=== Onboarding Aging Summary ===");
        log.info("Total Candidates: {}", allCandidates.size());
        log.info("Onboarding Completed: {}", completedCount);
        log.info("Onboarding Incomplete: {}", incompleteCount);
        log.info("Aging Distribution - GREEN (1 day): {}, AMBER (3 days): {}, RED (5+ days): {}", 
            greenCount, amberCount, redCount);
        log.info("=== Aging Calculation Complete ===");
    }
    
    /**
     * Determine aging level based on days and status
     */
    private AgingInfo determineAgingLevel(int days, String onboardingStatus) {
        boolean isCompleted = "COMPLETE".equalsIgnoreCase(onboardingStatus) || 
                              "COMPLETED".equalsIgnoreCase(onboardingStatus);
        
        String level;
        String color;
        String message;
        
        if (days >= RED_THRESHOLD) {
            level = "CRITICAL";
            color = "RED";
            if (isCompleted) {
                message = String.format("Onboarding completed %d days ago", days);
            } else {
                message = String.format("Onboarding incomplete for %d days - URGENT ACTION REQUIRED", days);
            }
        } else if (days >= AMBER_THRESHOLD) {
            level = "WARNING";
            color = "AMBER";
            if (isCompleted) {
                message = String.format("Onboarding completed %d days ago", days);
            } else {
                message = String.format("Onboarding incomplete for %d days - needs follow-up", days);
            }
        } else {
            level = "NORMAL";
            color = "GREEN";
            if (isCompleted) {
                message = String.format("Onboarding completed %d day(s) ago", days);
            } else {
                message = String.format("Onboarding in progress - %d day(s) since registration", days);
            }
        }
        
        return new AgingInfo(level, color, message);
    }
    
    /**
     * Get unread notification count
     */
    public Long getUnreadCount() {
        return notificationRepository.countByIsReadFalseAndIsDismissedFalse();
    }
    
    /**
     * Get all active notifications
     */
    public List<OnboardingAgingNotification> getAllActiveNotifications() {
        return notificationRepository.findAllActiveNotifications();
    }
    
    /**
     * Get notifications by color filter
     */
    public List<OnboardingAgingNotification> getNotificationsByColor(String color) {
        return notificationRepository.findByAgingColorAndIsDismissedFalseOrderByDaysSinceCreatedDesc(color);
    }
    
    /**
     * Get notifications by onboarding status filter
     */
    public List<OnboardingAgingNotification> getNotificationsByStatus(String status) {
        return notificationRepository.findByOnboardingStatusAndIsDismissedFalseOrderByDaysSinceCreatedDesc(status);
    }
    
    /**
     * Mark all notifications as read
     */
    @Transactional
    public int markAllAsRead() {
        return notificationRepository.markAllAsRead();
    }
    
    /**
     * Dismiss a notification
     */
    @Transactional
    public int dismissNotification(Long id) {
        return notificationRepository.dismissNotification(id);
    }
    
    /**
     * Get summary statistics
     */
    public Map<String, Object> getSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        List<Object[]> colorCounts = notificationRepository.getCountsByColor();
        Map<String, Long> byColor = new HashMap<>();
        for (Object[] row : colorCounts) {
            byColor.put((String) row[0], (Long) row[1]);
        }
        
        List<Object[]> statusCounts = notificationRepository.getCountsByOnboardingStatus();
        Map<String, Long> byStatus = new HashMap<>();
        for (Object[] row : statusCounts) {
            byStatus.put((String) row[0], (Long) row[1]);
        }
        
        summary.put("byColor", byColor);
        summary.put("byStatus", byStatus);
        summary.put("unreadCount", getUnreadCount());
        summary.put("totalActive", notificationRepository.findAllActiveNotifications().size());
        
        return summary;
    }
    
    /**
     * Clean up old dismissed notifications (older than 30 days)
     */
    @Transactional
    public int cleanupOldNotifications() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return notificationRepository.deleteOldDismissedNotifications(thirtyDaysAgo);
    }
    
    // Helper class for aging info
    private record AgingInfo(String level, String color, String message) {}
}
