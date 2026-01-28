package com.magicbus.controller;

import com.magicbus.dto.training.*;
import com.magicbus.service.TrainingBatchService;
import com.magicbus.service.TrainingMasterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/training")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class TrainingController {

    private final TrainingMasterService trainingService;
    private final TrainingBatchService batchService;

    // ================== Training Master Endpoints ==================

    /**
     * Get all trainings
     */
    @GetMapping("/masters")
    public ResponseEntity<List<TrainingMasterDTO>> getAllTrainings() {
        return ResponseEntity.ok(trainingService.getAllTrainings());
    }

    /**
     * Get active trainings only
     */
    @GetMapping("/masters/active")
    public ResponseEntity<List<TrainingMasterDTO>> getActiveTrainings() {
        return ResponseEntity.ok(trainingService.getActiveTrainings());
    }

    /**
     * Get training by ID
     */
    @GetMapping("/masters/{id}")
    public ResponseEntity<TrainingMasterDTO> getTrainingById(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.getTrainingById(id));
    }

    /**
     * Create a new training
     */
    @PostMapping("/masters")
    public ResponseEntity<TrainingMasterDTO> createTraining(@RequestBody CreateTrainingRequest request) {
        return ResponseEntity.ok(trainingService.createTraining(request));
    }

    /**
     * Update training
     */
    @PutMapping("/masters/{id}")
    public ResponseEntity<TrainingMasterDTO> updateTraining(
            @PathVariable Long id, 
            @RequestBody CreateTrainingRequest request) {
        return ResponseEntity.ok(trainingService.updateTraining(id, request));
    }

    /**
     * Toggle training active status
     */
    @PutMapping("/masters/{id}/toggle-active")
    public ResponseEntity<TrainingMasterDTO> toggleTrainingActive(@PathVariable Long id) {
        return ResponseEntity.ok(trainingService.toggleActive(id));
    }

    /**
     * Delete training
     */
    @DeleteMapping("/masters/{id}")
    public ResponseEntity<Void> deleteTraining(@PathVariable Long id) {
        trainingService.deleteTraining(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Get all skill categories
     */
    @GetMapping("/skill-categories")
    public ResponseEntity<List<String>> getSkillCategories() {
        return ResponseEntity.ok(trainingService.getAllSkillCategories());
    }

    // ================== Training Batch Endpoints ==================

    /**
     * Get all batches
     */
    @GetMapping("/batches")
    public ResponseEntity<List<TrainingBatchDTO>> getAllBatches() {
        return ResponseEntity.ok(batchService.getAllBatches());
    }

    /**
     * Get available batches (active with capacity)
     */
    @GetMapping("/batches/available")
    public ResponseEntity<List<TrainingBatchDTO>> getAvailableBatches() {
        return ResponseEntity.ok(batchService.getAvailableBatches());
    }

    /**
     * Get upcoming available batches
     */
    @GetMapping("/batches/upcoming")
    public ResponseEntity<List<TrainingBatchDTO>> getUpcomingBatches() {
        return ResponseEntity.ok(batchService.getUpcomingAvailableBatches());
    }

    /**
     * Get batches by training ID
     */
    @GetMapping("/masters/{trainingId}/batches")
    public ResponseEntity<List<TrainingBatchDTO>> getBatchesByTraining(@PathVariable Long trainingId) {
        return ResponseEntity.ok(batchService.getBatchesByTrainingId(trainingId));
    }

    /**
     * Get batch by ID
     */
    @GetMapping("/batches/{id}")
    public ResponseEntity<TrainingBatchDTO> getBatchById(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.getBatchById(id));
    }

    /**
     * Create a new batch
     */
    @PostMapping("/batches")
    public ResponseEntity<TrainingBatchDTO> createBatch(@RequestBody CreateBatchRequest request) {
        return ResponseEntity.ok(batchService.createBatch(request));
    }

    /**
     * Update batch
     */
    @PutMapping("/batches/{id}")
    public ResponseEntity<TrainingBatchDTO> updateBatch(
            @PathVariable Long id, 
            @RequestBody CreateBatchRequest request) {
        return ResponseEntity.ok(batchService.updateBatch(id, request));
    }

    /**
     * Toggle batch active status
     */
    @PutMapping("/batches/{id}/toggle-active")
    public ResponseEntity<TrainingBatchDTO> toggleBatchActive(@PathVariable Long id) {
        return ResponseEntity.ok(batchService.toggleActive(id));
    }

    /**
     * Delete batch
     */
    @DeleteMapping("/batches/{id}")
    public ResponseEntity<Void> deleteBatch(@PathVariable Long id) {
        batchService.deleteBatch(id);
        return ResponseEntity.noContent().build();
    }
}
