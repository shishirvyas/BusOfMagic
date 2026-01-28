package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_log", indexes = {
    @Index(name = "idx_audit_log_entity", columnList = "entity_type, entity_id"),
    @Index(name = "idx_audit_log_timestamp", columnList = "created_at")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditLog {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(length = 100, nullable = false)
    private String entityType;  // CANDIDATE, PLACEMENT, ASSESSMENT, etc.
    
    @Column(nullable = false)
    private Long entityId;
    
    @Column(length = 50, nullable = false)
    private String actionType;  // CREATE, UPDATE, DELETE, VIEW
    
    @Column(columnDefinition = "TEXT")
    private String oldValues;  // JSON of previous values
    
    @Column(columnDefinition = "TEXT")
    private String newValues;  // JSON of new values
    
    @Column(columnDefinition = "TEXT")
    private String changedFields;  // JSON array
    
    @Column(length = 255)
    private String performedBy;
    
    @Column(name = "ip_address", length = 45)
    private String ipAddress;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
