package com.magicbus.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "onboarding_question")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OnboardingQuestion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;
    
    @Column(length = 50, nullable = false)
    private String questionType;
    
    @Column(length = 100)
    private String questionCategory;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(columnDefinition = "TEXT")
    private String options;
    
    @Builder.Default
    private Boolean isMandatory = true;
    
    @Builder.Default
    private Boolean isActive = true;
    
    @Builder.Default
    private Integer displayOrder = 0;
    
    @Column(length = 500)
    private String helpText;
    
    @Column(length = 255)
    private String placeholderText;
    
    @Column(updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}
