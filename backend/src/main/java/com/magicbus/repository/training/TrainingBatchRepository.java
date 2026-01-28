package com.magicbus.repository.training;

import com.magicbus.entity.training.TrainingBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TrainingBatchRepository extends JpaRepository<TrainingBatch, Long> {

    List<TrainingBatch> findByTrainingId(Long trainingId);

    List<TrainingBatch> findByIsActiveTrue();

    @Query("SELECT tb FROM TrainingBatch tb " +
           "JOIN FETCH tb.training t " +
           "WHERE tb.isActive = true " +
           "AND tb.currentEnrolled < tb.maxCapacity " +
           "AND tb.startDate >= :today " +
           "ORDER BY tb.startDate ASC")
    List<TrainingBatch> findAvailableBatches(@Param("today") LocalDate today);

    @Query("SELECT tb FROM TrainingBatch tb " +
           "JOIN FETCH tb.training t " +
           "WHERE tb.isActive = true " +
           "AND tb.currentEnrolled < tb.maxCapacity " +
           "ORDER BY tb.startDate ASC")
    List<TrainingBatch> findAllAvailableBatches();

    @Query("SELECT tb FROM TrainingBatch tb " +
           "JOIN FETCH tb.training t " +
           "ORDER BY tb.createdAt DESC")
    List<TrainingBatch> findAllWithTraining();

    Optional<TrainingBatch> findByBatchCode(String batchCode);

    boolean existsByBatchCode(String batchCode);

    @Query("SELECT tb FROM TrainingBatch tb " +
           "JOIN FETCH tb.training t " +
           "WHERE tb.id = :id")
    Optional<TrainingBatch> findByIdWithTraining(@Param("id") Long id);

    List<TrainingBatch> findByStartDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT tb FROM TrainingBatch tb WHERE tb.training.id = :trainingId AND tb.isActive = true")
    List<TrainingBatch> findActiveByTrainingId(@Param("trainingId") Long trainingId);
}
