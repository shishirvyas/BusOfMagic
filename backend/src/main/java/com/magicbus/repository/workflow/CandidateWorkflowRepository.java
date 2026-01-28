package com.magicbus.repository.workflow;

import com.magicbus.entity.workflow.CandidateWorkflow;
import com.magicbus.entity.workflow.WorkflowStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CandidateWorkflowRepository extends JpaRepository<CandidateWorkflow, Long> {

    Optional<CandidateWorkflow> findByCandidateId(Long candidateId);

    List<CandidateWorkflow> findByStatus(WorkflowStatus status);

    List<CandidateWorkflow> findByStatusOrderByCreatedAtDesc(WorkflowStatus status);

    List<CandidateWorkflow> findByStatusIn(List<WorkflowStatus> statuses);

    @Query("SELECT cw FROM CandidateWorkflow cw " +
           "JOIN FETCH cw.candidate c " +
           "WHERE cw.status = :status " +
           "ORDER BY cw.createdAt DESC")
    List<CandidateWorkflow> findByStatusWithCandidate(@Param("status") WorkflowStatus status);

    @Query("SELECT cw FROM CandidateWorkflow cw " +
           "JOIN FETCH cw.candidate c " +
           "LEFT JOIN FETCH cw.trainingBatch tb " +
           "LEFT JOIN FETCH tb.training t " +
           "WHERE cw.status = :status " +
           "ORDER BY cw.createdAt DESC")
    List<CandidateWorkflow> findByStatusWithCandidateAndBatch(@Param("status") WorkflowStatus status);

    @Query("SELECT COUNT(cw) FROM CandidateWorkflow cw WHERE cw.status = :status")
    Long countByStatus(@Param("status") WorkflowStatus status);

    @Query("SELECT COUNT(cw) FROM CandidateWorkflow cw WHERE cw.status = :status " +
           "AND YEAR(cw.createdAt) = :year AND MONTH(cw.createdAt) = :month")
    Long countByStatusAndMonth(@Param("status") WorkflowStatus status, 
                               @Param("year") int year, 
                               @Param("month") int month);
    
    // Count by status and year only
    @Query("SELECT COUNT(cw) FROM CandidateWorkflow cw WHERE cw.status = :status " +
           "AND YEAR(cw.createdAt) = :year")
    Long countByStatusAndYear(@Param("status") WorkflowStatus status, 
                              @Param("year") int year);

    boolean existsByCandidateId(Long candidateId);
}
