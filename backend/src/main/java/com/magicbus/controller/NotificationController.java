package com.magicbus.controller;

import com.magicbus.dto.OnboardingAgingNotificationDTO;
import com.magicbus.entity.OnboardingAgingNotification;
import com.magicbus.service.OnboardingAgingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class NotificationController {
    
    private final OnboardingAgingService agingService;
    
    /**
     * Get all active notifications
     */
    @GetMapping
    public ResponseEntity<List<OnboardingAgingNotificationDTO>> getAllNotifications() {
        List<OnboardingAgingNotification> notifications = agingService.getAllActiveNotifications();
        return ResponseEntity.ok(convertToDTO(notifications));
    }
    
    /**
     * Get unread count for badge
     */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount() {
        Long count = agingService.getUnreadCount();
        return ResponseEntity.ok(Map.of("count", count));
    }
    
    /**
     * Get notifications by color filter
     */
    @GetMapping("/by-color/{color}")
    public ResponseEntity<List<OnboardingAgingNotificationDTO>> getByColor(@PathVariable String color) {
        List<OnboardingAgingNotification> notifications = agingService.getNotificationsByColor(color.toUpperCase());
        return ResponseEntity.ok(convertToDTO(notifications));
    }
    
    /**
     * Get notifications by onboarding status
     */
    @GetMapping("/by-status/{status}")
    public ResponseEntity<List<OnboardingAgingNotificationDTO>> getByStatus(@PathVariable String status) {
        List<OnboardingAgingNotification> notifications = agingService.getNotificationsByStatus(status.toUpperCase());
        return ResponseEntity.ok(convertToDTO(notifications));
    }
    
    /**
     * Get summary statistics
     */
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        return ResponseEntity.ok(agingService.getSummary());
    }
    
    /**
     * Mark all notifications as read
     */
    @PutMapping("/mark-all-read")
    public ResponseEntity<Map<String, Object>> markAllAsRead() {
        int updated = agingService.markAllAsRead();
        return ResponseEntity.ok(Map.of("message", "Marked all as read", "updated", updated));
    }
    
    /**
     * Dismiss a single notification
     */
    @PutMapping("/{id}/dismiss")
    public ResponseEntity<Map<String, Object>> dismissNotification(@PathVariable Long id) {
        int updated = agingService.dismissNotification(id);
        return ResponseEntity.ok(Map.of("message", "Notification dismissed", "updated", updated));
    }
    
    /**
     * Manually trigger aging calculation (for testing)
     */
    @PostMapping("/calculate")
    public ResponseEntity<Map<String, String>> triggerCalculation() {
        log.info("Manual trigger of aging calculation requested");
        agingService.calculateAndUpdateAging();
        return ResponseEntity.ok(Map.of("message", "Aging calculation triggered successfully"));
    }
    
    // Helper method to convert entities to DTOs
    private List<OnboardingAgingNotificationDTO> convertToDTO(List<OnboardingAgingNotification> notifications) {
        return notifications.stream()
            .map(n -> OnboardingAgingNotificationDTO.builder()
                .id(n.getId())
                .candidateId(n.getCandidateId())
                .candidateName(n.getCandidateName())
                .phoneNumber(n.getPhoneNumber())
                .onboardingStatus(n.getOnboardingStatus())
                .daysSinceCreated(n.getDaysSinceCreated())
                .agingLevel(n.getAgingLevel())
                .agingColor(n.getAgingColor())
                .message(n.getMessage())
                .isRead(n.getIsRead())
                .createdAt(n.getCreatedAt())
                .build())
            .collect(Collectors.toList());
    }
}
