package com.magicbus.repository;

import com.magicbus.entity.OnboardingAgingNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OnboardingAgingNotificationRepository extends JpaRepository<OnboardingAgingNotification, Long> {
    
    // Find by candidate ID (latest notification)
    Optional<OnboardingAgingNotification> findTopByCandidateIdOrderByCreatedAtDesc(Long candidateId);
    
    // Find all active (non-dismissed) notifications ordered by aging level severity
    @Query("SELECT n FROM OnboardingAgingNotification n WHERE n.isDismissed = false " +
           "ORDER BY CASE n.agingColor WHEN 'RED' THEN 1 WHEN 'AMBER' THEN 2 WHEN 'GREEN' THEN 3 ELSE 4 END, " +
           "n.daysSinceCreated DESC")
    List<OnboardingAgingNotification> findAllActiveNotifications();
    
    // Find unread notifications
    List<OnboardingAgingNotification> findByIsReadFalseAndIsDismissedFalseOrderByCreatedAtDesc();
    
    // Count unread notifications
    Long countByIsReadFalseAndIsDismissedFalse();
    
    // Find by aging color
    List<OnboardingAgingNotification> findByAgingColorAndIsDismissedFalseOrderByDaysSinceCreatedDesc(String agingColor);
    
    // Find by onboarding status
    List<OnboardingAgingNotification> findByOnboardingStatusAndIsDismissedFalseOrderByDaysSinceCreatedDesc(String onboardingStatus);
    
    // Mark all as read
    @Modifying
    @Query("UPDATE OnboardingAgingNotification n SET n.isRead = true WHERE n.isRead = false")
    int markAllAsRead();
    
    // Dismiss notification
    @Modifying
    @Query("UPDATE OnboardingAgingNotification n SET n.isDismissed = true WHERE n.id = :id")
    int dismissNotification(@Param("id") Long id);
    
    // Dismiss all notifications for a candidate (when their status changes)
    @Modifying
    @Query("UPDATE OnboardingAgingNotification n SET n.isDismissed = true WHERE n.candidateId = :candidateId")
    int dismissAllForCandidate(@Param("candidateId") Long candidateId);
    
    // Delete old dismissed notifications (cleanup)
    @Modifying
    @Query("DELETE FROM OnboardingAgingNotification n WHERE n.isDismissed = true AND n.updatedAt < :beforeDate")
    int deleteOldDismissedNotifications(@Param("beforeDate") java.time.LocalDateTime beforeDate);
    
    // Check if notification exists for candidate with same aging level
    boolean existsByCandidateIdAndAgingLevelAndIsDismissedFalse(Long candidateId, String agingLevel);
    
    // Get summary counts by color
    @Query("SELECT n.agingColor, COUNT(n) FROM OnboardingAgingNotification n " +
           "WHERE n.isDismissed = false GROUP BY n.agingColor")
    List<Object[]> getCountsByColor();
    
    // Get summary counts by onboarding status
    @Query("SELECT n.onboardingStatus, COUNT(n) FROM OnboardingAgingNotification n " +
           "WHERE n.isDismissed = false GROUP BY n.onboardingStatus")
    List<Object[]> getCountsByOnboardingStatus();
}
