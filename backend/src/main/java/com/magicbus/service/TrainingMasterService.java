package com.magicbus.service;

import com.magicbus.dto.training.CreateTrainingRequest;
import com.magicbus.dto.training.TrainingMasterDTO;
import com.magicbus.entity.training.TrainingMaster;
import com.magicbus.repository.training.TrainingMasterRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrainingMasterService {

    private final TrainingMasterRepository trainingRepository;

    /**
     * Get all trainings
     */
    public List<TrainingMasterDTO> getAllTrainings() {
        return trainingRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get active trainings
     */
    public List<TrainingMasterDTO> getActiveTrainings() {
        return trainingRepository.findByIsActiveTrueOrderByNameAsc()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get training by ID
     */
    public TrainingMasterDTO getTrainingById(Long id) {
        TrainingMaster training = trainingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training not found: " + id));
        return toDTO(training);
    }

    /**
     * Create a new training
     */
    @Transactional
    public TrainingMasterDTO createTraining(CreateTrainingRequest request) {
        if (trainingRepository.existsByName(request.getName())) {
            throw new RuntimeException("Training with this name already exists: " + request.getName());
        }

        TrainingMaster training = TrainingMaster.builder()
                .name(request.getName())
                .description(request.getDescription())
                .skillCategory(request.getSkillCategory())
                .durationDays(request.getDurationDays())
                .isActive(true)
                .build();

        training = trainingRepository.save(training);
        log.info("Created training: {}", training.getName());
        return toDTO(training);
    }

    /**
     * Update training
     */
    @Transactional
    public TrainingMasterDTO updateTraining(Long id, CreateTrainingRequest request) {
        TrainingMaster training = trainingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training not found: " + id));

        // Check for duplicate name (excluding current training)
        trainingRepository.findByName(request.getName())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new RuntimeException("Training with this name already exists: " + request.getName());
                    }
                });

        training.setName(request.getName());
        training.setDescription(request.getDescription());
        training.setSkillCategory(request.getSkillCategory());
        training.setDurationDays(request.getDurationDays());

        training = trainingRepository.save(training);
        log.info("Updated training: {}", training.getName());
        return toDTO(training);
    }

    /**
     * Toggle training active status
     */
    @Transactional
    public TrainingMasterDTO toggleActive(Long id) {
        TrainingMaster training = trainingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Training not found: " + id));

        training.setIsActive(!training.getIsActive());
        training = trainingRepository.save(training);
        log.info("Training {} is now {}", training.getName(), training.getIsActive() ? "active" : "inactive");
        return toDTO(training);
    }

    /**
     * Delete training
     */
    @Transactional
    public void deleteTraining(Long id) {
        TrainingMaster training = trainingRepository.findByIdWithBatches(id)
                .orElseThrow(() -> new RuntimeException("Training not found: " + id));

        if (!training.getBatches().isEmpty()) {
            throw new RuntimeException("Cannot delete training with existing batches. Deactivate instead.");
        }

        trainingRepository.delete(training);
        log.info("Deleted training: {}", training.getName());
    }

    /**
     * Get all skill categories
     */
    public List<String> getAllSkillCategories() {
        return trainingRepository.findAllSkillCategories();
    }

    /**
     * Convert entity to DTO
     */
    private TrainingMasterDTO toDTO(TrainingMaster training) {
        long totalBatches = training.getBatches() != null ? training.getBatches().size() : 0;
        long activeBatches = training.getBatches() != null ? 
                training.getBatches().stream().filter(b -> b.getIsActive()).count() : 0;

        return TrainingMasterDTO.builder()
                .id(training.getId())
                .name(training.getName())
                .description(training.getDescription())
                .skillCategory(training.getSkillCategory())
                .durationDays(training.getDurationDays())
                .isActive(training.getIsActive())
                .totalBatches((int) totalBatches)
                .activeBatches((int) activeBatches)
                .createdAt(training.getCreatedAt())
                .updatedAt(training.getUpdatedAt())
                .build();
    }
}
