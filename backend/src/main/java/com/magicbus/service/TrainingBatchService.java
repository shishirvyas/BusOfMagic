package com.magicbus.service;

import com.magicbus.dto.training.CreateBatchRequest;
import com.magicbus.dto.training.TrainingBatchDTO;
import com.magicbus.entity.training.TrainingBatch;
import com.magicbus.entity.training.TrainingMaster;
import com.magicbus.repository.training.TrainingBatchRepository;
import com.magicbus.repository.training.TrainingMasterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrainingBatchService {

    private final TrainingBatchRepository batchRepository;
    private final TrainingMasterRepository trainingRepository;

    /**
     * Get all batches
     */
    public List<TrainingBatchDTO> getAllBatches() {
        return batchRepository.findAllWithTraining()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get available batches (active with capacity)
     */
    public List<TrainingBatchDTO> getAvailableBatches() {
        return batchRepository.findAllAvailableBatches()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get upcoming available batches
     */
    public List<TrainingBatchDTO> getUpcomingAvailableBatches() {
        return batchRepository.findAvailableBatches(LocalDate.now())
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get batches by training ID
     */
    public List<TrainingBatchDTO> getBatchesByTrainingId(Long trainingId) {
        return batchRepository.findByTrainingId(trainingId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get batch by ID
     */
    public TrainingBatchDTO getBatchById(Long id) {
        TrainingBatch batch = batchRepository.findByIdWithTraining(id)
                .orElseThrow(() -> new RuntimeException("Batch not found: " + id));
        return toDTO(batch);
    }

    /**
     * Create a new batch
     */
    @Transactional
    public TrainingBatchDTO createBatch(CreateBatchRequest request) {
        if (batchRepository.existsByBatchCode(request.getBatchCode())) {
            throw new RuntimeException("Batch code already exists: " + request.getBatchCode());
        }

        TrainingMaster training = trainingRepository.findById(request.getTrainingId())
                .orElseThrow(() -> new RuntimeException("Training not found: " + request.getTrainingId()));

        if (!training.getIsActive()) {
            throw new RuntimeException("Cannot create batch for inactive training");
        }

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date must be after start date");
        }

        TrainingBatch batch = TrainingBatch.builder()
                .training(training)
                .batchCode(request.getBatchCode())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .maxCapacity(request.getMaxCapacity() != null ? request.getMaxCapacity() : 30)
                .currentEnrolled(0)
                .location(request.getLocation())
                .trainerName(request.getTrainerName())
                .isActive(true)
                .build();

        batch = batchRepository.save(batch);
        log.info("Created batch: {} for training: {}", batch.getBatchCode(), training.getName());
        return toDTO(batch);
    }

    /**
     * Update batch
     */
    @Transactional
    public TrainingBatchDTO updateBatch(Long id, CreateBatchRequest request) {
        TrainingBatch batch = batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found: " + id));

        // Check for duplicate batch code (excluding current batch)
        batchRepository.findByBatchCode(request.getBatchCode())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Batch code already exists: " + request.getBatchCode());
                    }
                });

        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new RuntimeException("End date must be after start date");
        }

        // Update training if changed
        if (!batch.getTraining().getId().equals(request.getTrainingId())) {
            TrainingMaster training = trainingRepository.findById(request.getTrainingId())
                    .orElseThrow(() -> new RuntimeException("Training not found: " + request.getTrainingId()));
            batch.setTraining(training);
        }

        batch.setBatchCode(request.getBatchCode());
        batch.setStartDate(request.getStartDate());
        batch.setEndDate(request.getEndDate());
        if (request.getMaxCapacity() != null) {
            if (request.getMaxCapacity() < batch.getCurrentEnrolled()) {
                throw new RuntimeException("Cannot reduce capacity below current enrollment");
            }
            batch.setMaxCapacity(request.getMaxCapacity());
        }
        batch.setLocation(request.getLocation());
        batch.setTrainerName(request.getTrainerName());

        batch = batchRepository.save(batch);
        log.info("Updated batch: {}", batch.getBatchCode());
        return toDTO(batch);
    }

    /**
     * Toggle batch active status
     */
    @Transactional
    public TrainingBatchDTO toggleActive(Long id) {
        TrainingBatch batch = batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found: " + id));

        batch.setIsActive(!batch.getIsActive());
        batch = batchRepository.save(batch);
        log.info("Batch {} is now {}", batch.getBatchCode(), batch.getIsActive() ? "active" : "inactive");
        return toDTO(batch);
    }

    /**
     * Delete batch
     */
    @Transactional
    public void deleteBatch(Long id) {
        TrainingBatch batch = batchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Batch not found: " + id));

        if (batch.getCurrentEnrolled() > 0) {
            throw new RuntimeException("Cannot delete batch with enrolled candidates. Deactivate instead.");
        }

        batchRepository.delete(batch);
        log.info("Deleted batch: {}", batch.getBatchCode());
    }

    /**
     * Convert entity to DTO
     */
    private TrainingBatchDTO toDTO(TrainingBatch batch) {
        TrainingMaster training = batch.getTraining();
        
        return TrainingBatchDTO.builder()
                .id(batch.getId())
                .trainingId(training.getId())
                .trainingName(training.getName())
                .skillCategory(training.getSkillCategory())
                .batchCode(batch.getBatchCode())
                .startDate(batch.getStartDate())
                .endDate(batch.getEndDate())
                .maxCapacity(batch.getMaxCapacity())
                .currentEnrolled(batch.getCurrentEnrolled())
                .availableSlots(batch.getAvailableSlots())
                .location(batch.getLocation())
                .trainerName(batch.getTrainerName())
                .isActive(batch.getIsActive())
                .createdAt(batch.getCreatedAt())
                .updatedAt(batch.getUpdatedAt())
                .build();
    }
}
