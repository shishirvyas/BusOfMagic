package com.magicbus.controller;

import com.magicbus.dto.training.TrainingCalendarDTO;
import com.magicbus.entity.Candidate;
import com.magicbus.entity.training.TrainingBatch;
import com.magicbus.entity.training.TrainingMaster;
import com.magicbus.entity.workflow.CandidateWorkflow;
import com.magicbus.repository.training.TrainingBatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/training-calendar")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class TrainingCalendarController {

    private final TrainingBatchRepository batchRepository;

    /**
     * Get all training calendar data with enrolled candidates
     */
    @GetMapping
    public ResponseEntity<List<TrainingCalendarDTO>> getTrainingCalendar(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long trainingId,
            @RequestParam(required = false) Boolean activeOnly) {
        
        log.info("Fetching training calendar - startDate: {}, endDate: {}, trainingId: {}, activeOnly: {}", 
                startDate, endDate, trainingId, activeOnly);
        
        List<TrainingBatch> batches = batchRepository.findAllWithEnrolledCandidates();
        
        // Apply filters
        if (startDate != null) {
            batches = batches.stream()
                    .filter(b -> !b.getStartDate().isBefore(startDate))
                    .collect(Collectors.toList());
        }
        if (endDate != null) {
            batches = batches.stream()
                    .filter(b -> !b.getEndDate().isAfter(endDate))
                    .collect(Collectors.toList());
        }
        if (trainingId != null) {
            batches = batches.stream()
                    .filter(b -> b.getTraining().getId().equals(trainingId))
                    .collect(Collectors.toList());
        }
        if (Boolean.TRUE.equals(activeOnly)) {
            batches = batches.stream()
                    .filter(TrainingBatch::getIsActive)
                    .collect(Collectors.toList());
        }
        
        List<TrainingCalendarDTO> result = batches.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    /**
     * Get training calendar for a specific month
     */
    @GetMapping("/month/{year}/{month}")
    public ResponseEntity<List<TrainingCalendarDTO>> getCalendarByMonth(
            @PathVariable int year,
            @PathVariable int month) {
        
        LocalDate startOfMonth = LocalDate.of(year, month, 1);
        LocalDate endOfMonth = startOfMonth.plusMonths(1).minusDays(1);
        
        log.info("Fetching training calendar for month: {}/{}", year, month);
        
        List<TrainingBatch> batches = batchRepository.findBatchesInDateRange(startOfMonth, endOfMonth);
        
        List<TrainingCalendarDTO> result = batches.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(result);
    }

    /**
     * Get calendar summary stats
     */
    @GetMapping("/summary")
    public ResponseEntity<CalendarSummaryDTO> getCalendarSummary() {
        List<TrainingBatch> activeBatches = batchRepository.findByIsActiveTrue();
        
        int totalBatches = activeBatches.size();
        int totalCapacity = activeBatches.stream().mapToInt(TrainingBatch::getMaxCapacity).sum();
        int totalEnrolled = activeBatches.stream().mapToInt(TrainingBatch::getCurrentEnrolled).sum();
        int totalAvailable = totalCapacity - totalEnrolled;
        
        // Upcoming batches (starting in future)
        long upcomingBatches = activeBatches.stream()
                .filter(b -> b.getStartDate().isAfter(LocalDate.now()))
                .count();
        
        // Ongoing batches
        long ongoingBatches = activeBatches.stream()
                .filter(b -> !b.getStartDate().isAfter(LocalDate.now()) && !b.getEndDate().isBefore(LocalDate.now()))
                .count();
        
        CalendarSummaryDTO summary = CalendarSummaryDTO.builder()
                .totalActiveBatches(totalBatches)
                .upcomingBatches((int) upcomingBatches)
                .ongoingBatches((int) ongoingBatches)
                .totalCapacity(totalCapacity)
                .totalEnrolled(totalEnrolled)
                .totalAvailableSlots(totalAvailable)
                .occupancyRate(totalCapacity > 0 ? (double) totalEnrolled / totalCapacity * 100 : 0)
                .build();
        
        return ResponseEntity.ok(summary);
    }

    /**
     * Get single batch details with enrolled candidates
     */
    @GetMapping("/batch/{batchId}")
    public ResponseEntity<TrainingCalendarDTO> getBatchDetails(@PathVariable Long batchId) {
        TrainingBatch batch = batchRepository.findByIdWithEnrolledCandidates(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found: " + batchId));
        
        return ResponseEntity.ok(toDTO(batch));
    }

    private TrainingCalendarDTO toDTO(TrainingBatch batch) {
        TrainingMaster training = batch.getTraining();
        
        List<TrainingCalendarDTO.EnrolledCandidateDTO> enrolledCandidates = batch.getEnrolledCandidates().stream()
                .map(workflow -> {
                    Candidate c = workflow.getCandidate();
                    return TrainingCalendarDTO.EnrolledCandidateDTO.builder()
                            .candidateId(c.getId())
                            .firstName(c.getFirstName())
                            .lastName(c.getLastName())
                            .email(c.getEmail())
                            .phoneNumber(c.getPhoneNumber())
                            .city(c.getCity())
                            .state(c.getState())
                            .gender(c.getGender())
                            .enrolledAt(workflow.getEnrolledAt() != null ? workflow.getEnrolledAt().toLocalDate() : null)
                            .enrolledByName(workflow.getEnrolledBy() != null ? 
                                    workflow.getEnrolledBy().getFirstName() + " " + workflow.getEnrolledBy().getLastName() : null)
                            .build();
                })
                .collect(Collectors.toList());
        
        return TrainingCalendarDTO.builder()
                .batchId(batch.getId())
                .batchCode(batch.getBatchCode())
                .trainingId(training.getId())
                .trainingName(training.getName())
                .skillCategory(training.getSkillCategory())
                .startDate(batch.getStartDate())
                .endDate(batch.getEndDate())
                .durationDays(training.getDurationDays())
                .location(batch.getLocation())
                .trainerName(batch.getTrainerName())
                .maxCapacity(batch.getMaxCapacity())
                .currentEnrolled(batch.getCurrentEnrolled())
                .availableSlots(batch.getAvailableSlots())
                .isActive(batch.getIsActive())
                .enrolledCandidates(enrolledCandidates)
                .build();
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    @lombok.Builder
    public static class CalendarSummaryDTO {
        private int totalActiveBatches;
        private int upcomingBatches;
        private int ongoingBatches;
        private int totalCapacity;
        private int totalEnrolled;
        private int totalAvailableSlots;
        private double occupancyRate;
    }
}
