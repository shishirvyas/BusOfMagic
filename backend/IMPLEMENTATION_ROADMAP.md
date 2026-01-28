# Implementation Checklist & Next Steps

## ✅ Completed

- [x] Database schema design (16 tables)
- [x] JPA entity classes (15 entities)
- [x] SQL migrations (V1__initial_schema.sql)
- [x] Comprehensive documentation
- [x] Quick reference guide
- [x] AI field mapping
- [x] Index strategy
- [x] Sample queries

---

## 🚀 Next Steps - Phase by Phase

### Phase 1: Backend Infrastructure (1-2 weeks)

#### 1.1 Database Setup
- [ ] Install PostgreSQL 12+
- [ ] Create database: `magic_bus_onboarding`
- [ ] Run migration: `V1__initial_schema.sql`
- [ ] Verify all tables created
- [ ] Test sample queries

```bash
# Create database
psql -U postgres -c "CREATE DATABASE magic_bus_onboarding;"

# Run migration
psql -U postgres -d magic_bus_onboarding -f backend/src/main/resources/db/migration/V1__initial_schema.sql

# Verify
psql -U postgres -d magic_bus_onboarding -c "\dt"
```

#### 1.2 Spring Boot Configuration
- [ ] Update `application.yml` with PostgreSQL config
- [ ] Add Flyway dependency to `pom.xml`
- [ ] Configure JPA/Hibernate settings
- [ ] Test database connection from Spring Boot

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/magic_bus_onboarding
    username: postgres
    password: ${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQL10Dialect
        jdbc:
          batch_size: 20
  flyway:
    locations: classpath:db/migration
    baseline-on-migrate: true
```

#### 1.3 Repository Layer
Create Spring Data JPA repositories for each entity:

```java
// CandidateRepository.java
@Repository
public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    Optional<Candidate> findByPhoneNumber(String phoneNumber);
    Optional<Candidate> findByEmail(String email);
    List<Candidate> findByStatus(String status);
    List<Candidate> findByDropoutRiskScoreGreaterThan(BigDecimal score);
    List<Candidate> findByCityAndState(String city, String state);
}

// DropoutRiskRepository.java
@Repository
public interface DropoutRiskRepository extends JpaRepository<DropoutRisk, Long> {
    List<DropoutRisk> findByCandidateId(Long candidateId);
    List<DropoutRisk> findByRiskCategoryIn(List<String> categories);
    List<DropoutRisk> findByInterventionStatusEquals(String status);
}

// EngagementEventRepository.java
@Repository
public interface EngagementEventRepository extends JpaRepository<EngagementEvent, Long> {
    List<EngagementEvent> findByCandidateIdOrderByEventDateDesc(Long candidateId);
    List<EngagementEvent> findByEventTypeAndEventDateAfter(String eventType, LocalDateTime date);
    Page<EngagementEvent> findByCandidateId(Long candidateId, Pageable pageable);
}

// PlacementRepository.java
@Repository
public interface PlacementRepository extends JpaRepository<Placement, Long> {
    List<Placement> findByPlacementStatus(String status);
    List<Placement> findByCandidateId(Long candidateId);
    List<Placement> findByEmployerId(Long employerId);
    List<Placement> findByIsCurrentlyActiveTrue();
}
```

---

### Phase 2: Business Logic Services (2-3 weeks)

#### 2.1 Engagement Scoring Service
```java
@Service
public class EngagementScoringService {
    
    @Autowired
    private EngagementEventRepository eventRepository;
    
    @Autowired
    private CandidateRepository candidateRepository;
    
    /**
     * Calculate engagement score for a candidate
     * Formula: Sum of engagement_weight_points from all events
     */
    public BigDecimal calculateEngagementScore(Long candidateId) {
        BigDecimal score = eventRepository.findByCandidateId(candidateId)
            .stream()
            .map(EngagementEvent::getEngagementWeightPoints)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        // Update candidate
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow();
        candidate.setEngagementScore(score);
        candidateRepository.save(candidate);
        
        return score;
    }
    
    /**
     * Record an engagement event
     */
    public EngagementEvent recordEvent(Long candidateId, String eventType, 
                                       BigDecimal weightPoints) {
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow();
        
        EngagementEvent event = EngagementEvent.builder()
            .candidate(candidate)
            .eventType(eventType)
            .engagementWeightPoints(weightPoints)
            .eventDate(LocalDateTime.now())
            .status("COMPLETED")
            .build();
        
        return eventRepository.save(event);
    }
}
```

#### 2.2 Dropout Risk Service
```java
@Service
public class DropoutRiskService {
    
    @Autowired
    private DropoutRiskRepository dropoutRiskRepository;
    
    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private EngagementEventRepository engagementEventRepository;
    
    /**
     * Calculate dropout risk for a candidate
     * Triggers AI model prediction
     */
    public DropoutRisk calculateDropoutRisk(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow();
        
        // Collect input features
        BigDecimal engagementScore = candidate.getEngagementScore();
        Integer daysSinceLastActivity = calculateDaysSinceLastActivity(candidateId);
        Integer missedSessions = countMissedSessions(candidateId);
        Integer failedAssessments = countFailedAssessments(candidateId);
        
        // Call AI model (placeholder)
        DropoutPrediction prediction = callAIModel(
            engagementScore, daysSinceLastActivity, 
            missedSessions, failedAssessments
        );
        
        // Create/update DropoutRisk record
        DropoutRisk risk = DropoutRisk.builder()
            .candidate(candidate)
            .riskScore(prediction.getRiskScore())
            .riskCategory(categorizeRisk(prediction.getRiskScore()))
            .riskFactors(prediction.getRiskFactors())
            .engagementDeclineDetected(prediction.isEngagementDecline())
            .attendanceDeclineDetected(prediction.isAttendanceDecline())
            .daysSinceLastActivity(daysSinceLastActivity)
            .missedSessionsCount(missedSessions)
            .failedAssessmentsCount(failedAssessments)
            .suggestedInterventions(prediction.getInterventions())
            .interventionPriority(prediction.getPriority())
            .modelVersion("v2.1")
            .confidenceScore(prediction.getConfidenceScore())
            .predictionDate(LocalDateTime.now())
            .build();
        
        // Save and trigger intervention if needed
        DropoutRisk saved = dropoutRiskRepository.save(risk);
        
        if ("HIGH".equals(saved.getRiskCategory()) || 
            "CRITICAL".equals(saved.getRiskCategory())) {
            triggerIntervention(candidateId);
        }
        
        return saved;
    }
    
    private Integer calculateDaysSinceLastActivity(Long candidateId) {
        return engagementEventRepository
            .findByCandidateIdOrderByEventDateDesc(candidateId)
            .stream()
            .findFirst()
            .map(event -> (int) java.time.temporal.ChronoUnit.DAYS
                .between(event.getEventDate().toLocalDate(), LocalDate.now()))
            .orElse(999);
    }
    
    private String categorizeRisk(BigDecimal score) {
        if (score.compareTo(BigDecimal.valueOf(75)) >= 0) return "CRITICAL";
        if (score.compareTo(BigDecimal.valueOf(50)) >= 0) return "HIGH";
        if (score.compareTo(BigDecimal.valueOf(25)) >= 0) return "MEDIUM";
        return "LOW";
    }
    
    private void triggerIntervention(Long candidateId) {
        // Assign mentor, send notifications, etc.
        // TODO: Implement intervention logic
    }
}
```

#### 2.3 Onboarding Service
```java
@Service
public class OnboardingService {
    
    @Autowired
    private CandidateOnboardingProgressRepository progressRepository;
    
    @Autowired
    private OnboardingStepRepository stepRepository;
    
    /**
     * Initialize onboarding for new candidate
     */
    public void initializeOnboarding(Long candidateId) {
        List<OnboardingStep> mandatorySteps = stepRepository
            .findByIsMandatoryTrue()
            .stream()
            .sorted(Comparator.comparingInt(OnboardingStep::getStepOrder))
            .collect(Collectors.toList());
        
        for (OnboardingStep step : mandatorySteps) {
            CandidateOnboardingProgress progress = CandidateOnboardingProgress.builder()
                .candidateId(candidateId)
                .onboardingStepId(step.getId())
                .status("PENDING")
                .completionPercentage(0)
                .build();
            
            progressRepository.save(progress);
        }
    }
    
    /**
     * Mark step as completed
     */
    public void completeStep(Long candidateId, Long stepId) {
        CandidateOnboardingProgress progress = progressRepository
            .findByCandiateIdAndOnboardingStepId(candidateId, stepId);
        
        progress.setStatus("COMPLETED");
        progress.setCompletionPercentage(100);
        progress.setCompletedDate(LocalDateTime.now());
        progressRepository.save(progress);
    }
    
    /**
     * Get onboarding completion status
     */
    public OnboardingStatusDTO getOnboardingStatus(Long candidateId) {
        List<CandidateOnboardingProgress> progress = progressRepository
            .findByCandidateId(candidateId);
        
        long completed = progress.stream()
            .filter(p -> "COMPLETED".equals(p.getStatus()))
            .count();
        
        int totalPercentage = (int) ((completed * 100) / progress.size());
        
        return OnboardingStatusDTO.builder()
            .totalSteps(progress.size())
            .completedSteps((int) completed)
            .completionPercentage(totalPercentage)
            .currentStep(progress.stream()
                .filter(p -> "IN_PROGRESS".equals(p.getStatus()))
                .findFirst()
                .orElse(null))
            .build();
    }
}
```

#### 2.4 Placement Service
```java
@Service
public class PlacementService {
    
    @Autowired
    private PlacementRepository placementRepository;
    
    @Autowired
    private CandidateRepository candidateRepository;
    
    /**
     * Find best matched jobs for candidate
     */
    public List<JobOpening> findMatchedJobs(Long candidateId) {
        Candidate candidate = candidateRepository.findById(candidateId)
            .orElseThrow();
        
        // Algorithm: Match candidate skills with job requirements
        // Calculate match score
        // Return sorted by match score
        
        return new ArrayList<>(); // TODO: Implement matching
    }
    
    /**
     * Create placement record
     */
    public Placement createPlacement(Long candidateId, Long jobOpeningId, 
                                     Long employerId) {
        Placement placement = Placement.builder()
            .candidateId(candidateId)
            .jobOpeningId(jobOpeningId)
            .employerId(employerId)
            .placementStatus("PENDING")
            .build();
        
        return placementRepository.save(placement);
    }
    
    /**
     * Update placement status
     */
    public void updatePlacementStatus(Long placementId, String newStatus) {
        Placement placement = placementRepository.findById(placementId)
            .orElseThrow();
        
        placement.setPlacementStatus(newStatus);
        
        if ("JOINED".equals(newStatus)) {
            placement.setJoiningDate(LocalDate.now());
            placement.setIsCurrentlyActive(true);
        }
        
        placementRepository.save(placement);
    }
}
```

---

### Phase 3: REST APIs (2 weeks)

#### 3.1 Candidate API
```java
@RestController
@RequestMapping("/api/candidates")
public class CandidateController {
    
    @Autowired
    private CandidateRepository repository;
    
    @Autowired
    private EngagementScoringService scoringService;
    
    @Autowired
    private DropoutRiskService riskService;
    
    @PostMapping
    public ResponseEntity<Candidate> createCandidate(@RequestBody CandidateDTO dto) {
        Candidate candidate = new Candidate();
        // Map DTO to entity
        return ResponseEntity.ok(repository.save(candidate));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Candidate> getCandidate(@PathVariable Long id) {
        return repository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/{id}/engagement-score")
    public ResponseEntity<BigDecimal> getEngagementScore(@PathVariable Long id) {
        BigDecimal score = scoringService.calculateEngagementScore(id);
        return ResponseEntity.ok(score);
    }
    
    @GetMapping("/{id}/dropout-risk")
    public ResponseEntity<DropoutRisk> getDropoutRisk(@PathVariable Long id) {
        DropoutRisk risk = riskService.calculateDropoutRisk(id);
        return ResponseEntity.ok(risk);
    }
    
    @GetMapping("/at-risk")
    public ResponseEntity<List<Candidate>> getAtRiskCandidates() {
        List<Candidate> candidates = repository
            .findByRiskCategoryIn(List.of("HIGH", "CRITICAL"));
        return ResponseEntity.ok(candidates);
    }
}
```

#### 3.2 Onboarding API
```java
@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {
    
    @Autowired
    private OnboardingService service;
    
    @PostMapping("/{candidateId}/initialize")
    public ResponseEntity<Void> initializeOnboarding(@PathVariable Long candidateId) {
        service.initializeOnboarding(candidateId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{candidateId}/status")
    public ResponseEntity<OnboardingStatusDTO> getStatus(@PathVariable Long candidateId) {
        return ResponseEntity.ok(service.getOnboardingStatus(candidateId));
    }
    
    @PutMapping("/{candidateId}/step/{stepId}/complete")
    public ResponseEntity<Void> completeStep(
        @PathVariable Long candidateId,
        @PathVariable Long stepId) {
        service.completeStep(candidateId, stepId);
        return ResponseEntity.ok().build();
    }
}
```

#### 3.3 Placement API
```java
@RestController
@RequestMapping("/api/placements")
public class PlacementController {
    
    @Autowired
    private PlacementService service;
    
    @GetMapping("/candidate/{candidateId}/matches")
    public ResponseEntity<List<JobOpening>> getMatchedJobs(
        @PathVariable Long candidateId) {
        return ResponseEntity.ok(service.findMatchedJobs(candidateId));
    }
    
    @PostMapping
    public ResponseEntity<Placement> createPlacement(
        @RequestBody PlacementDTO dto) {
        Placement placement = service.createPlacement(
            dto.getCandidateId(),
            dto.getJobOpeningId(),
            dto.getEmployerId()
        );
        return ResponseEntity.ok(placement);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Placement> getPlacement(@PathVariable Long id) {
        // TODO: Implement
        return ResponseEntity.ok().build();
    }
}
```

---

### Phase 4: Scheduled Jobs & AI (3 weeks)

#### 4.1 Engagement Scoring Batch Job
```java
@Component
public class EngagementScoringBatchJob {
    
    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private EngagementScoringService scoringService;
    
    @Scheduled(cron = "0 2 * * *")  // Run daily at 2 AM
    public void calculateEngagementScores() {
        List<Candidate> candidates = candidateRepository.findByStatusEquals("ACTIVE");
        
        for (Candidate candidate : candidates) {
            try {
                scoringService.calculateEngagementScore(candidate.getId());
            } catch (Exception e) {
                // Log error
            }
        }
    }
}
```

#### 4.2 Dropout Risk Prediction Batch Job
```java
@Component
public class DropoutRiskBatchJob {
    
    @Autowired
    private CandidateRepository candidateRepository;
    
    @Autowired
    private DropoutRiskService riskService;
    
    @Scheduled(cron = "0 3 * * *")  // Run daily at 3 AM
    public void predictDropoutRisks() {
        List<Candidate> candidates = candidateRepository.findByStatusEquals("ACTIVE");
        
        for (Candidate candidate : candidates) {
            try {
                riskService.calculateDropoutRisk(candidate.getId());
            } catch (Exception e) {
                // Log error
            }
        }
    }
}
```

#### 4.3 AI Model Integration
```java
@Service
public class AIModelService {
    
    /**
     * Call external AI service for dropout prediction
     */
    public DropoutPrediction predictDropout(DropoutInputFeatures features) {
        // Call Python/ML service or OpenAI API
        // POST to /ml-service/predict
        
        return new DropoutPrediction();
    }
    
    /**
     * Call skill gap analysis AI
     */
    public SkillGapAnalysis analyzeSkillGaps(Long candidateId, Long jobOpeningId) {
        // Compare candidate skills with job requirements
        // Return gap analysis
        
        return new SkillGapAnalysis();
    }
}
```

---

### Phase 5: Frontend Integration (2 weeks)

Create React components in frontend for:

#### 5.1 Candidate Dashboard
```
/dashboard/candidate/
├── Overview
│   ├── Engagement score widget
│   ├── Dropout risk indicator
│   ├── Onboarding progress
│   └── Recent activity
├── Onboarding
│   ├── Current step
│   ├── Step list with progress
│   └── Form components
└── Placement
    ├── Matched jobs
    ├── Application status
    └── Interview schedule
```

#### 5.2 Mentor Dashboard
```
/dashboard/mentor/
├── My Candidates
│   ├── List with risk levels
│   ├── Engagement scores
│   └── Action items
├── At-Risk Alerts
│   ├── High-risk list
│   ├── Intervention tracking
│   └── Interaction logs
└── Analytics
    ├── Engagement trends
    ├── Placement outcomes
    └── Performance metrics
```

#### 5.3 Admin Analytics
```
/dashboard/admin/
├── Program Metrics
│   ├── Enrollment stats
│   ├── Completion rates
│   ├── Dropout rates
│   └── Placement rate
├── Cohort Analysis
│   ├── Compare cohorts
│   ├── Demographic breakdown
│   └── Success metrics
└── Employer Reports
    ├── Hiring volume
    ├── Candidate retention
    └── Satisfaction scores
```

---

## 📋 Detailed Checklist

### Database & Infrastructure
- [ ] PostgreSQL installed (v12+)
- [ ] Database created
- [ ] Migrations run successfully
- [ ] All 16 tables created
- [ ] Indexes created
- [ ] Test data inserted
- [ ] Backup strategy defined

### Spring Boot Backend
- [ ] Project setup complete
- [ ] Dependencies added (JPA, PostgreSQL, Flyway)
- [ ] Entity classes created (15 entities)
- [ ] Repositories created (15+ repositories)
- [ ] Services created (5+ services)
- [ ] Controllers created (5+ controllers)
- [ ] Exception handling
- [ ] Logging configured
- [ ] Tests written
- [ ] Documentation generated

### APIs
- [ ] Candidate CRUD APIs
- [ ] Onboarding APIs
- [ ] Engagement APIs
- [ ] Dropout risk APIs
- [ ] Placement APIs
- [ ] Employer APIs
- [ ] Job opening APIs
- [ ] Analytics APIs
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Error handling
- [ ] Input validation
- [ ] Authentication/Authorization

### Batch Jobs & Scheduling
- [ ] Engagement scoring job (daily)
- [ ] Dropout risk job (daily)
- [ ] Notification job (real-time)
- [ ] Report generation (weekly)
- [ ] Data archival job (monthly)
- [ ] Monitoring & alerts

### Frontend
- [ ] Candidate dashboard
- [ ] Mentor dashboard
- [ ] Admin dashboard
- [ ] Onboarding forms
- [ ] Placement matching UI
- [ ] Analytics dashboards
- [ ] Reports export

### Testing
- [ ] Unit tests (80%+ coverage)
- [ ] Integration tests
- [ ] API tests
- [ ] Load testing
- [ ] Security testing
- [ ] Performance testing

### DevOps & Deployment
- [ ] Docker setup
- [ ] CI/CD pipeline
- [ ] Database backup strategy
- [ ] Monitoring setup (ELK stack)
- [ ] Performance monitoring
- [ ] Log aggregation
- [ ] Alerting system

### Documentation
- [ ] API documentation (Swagger)
- [ ] Database schema docs ✅
- [ ] Architecture docs
- [ ] Deployment guide
- [ ] User manual
- [ ] Admin guide

---

## 🎯 Success Criteria

### By End of Month 1
- [ ] All databases tables and JPA entities created
- [ ] Core business logic services implemented
- [ ] REST APIs functional
- [ ] Candidate enrollment workflow working
- [ ] Engagement tracking working

### By End of Month 2
- [ ] Onboarding workflow complete
- [ ] Dropout risk prediction running
- [ ] Mentor assignment working
- [ ] Dashboard prototypes done
- [ ] Integration testing passed

### By End of Month 3
- [ ] Full feature parity with design
- [ ] AI models integrated
- [ ] Production-ready infrastructure
- [ ] 80%+ test coverage
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Ready for pilot launch

---

## 💡 Key Resources

### Documentation Files
- `DATABASE_SCHEMA_DESIGN.md` - Complete schema design (this repo)
- `DATABASE_QUICK_REFERENCE.md` - Quick lookup guide
- Entity Java files - 15 JPA entity classes
- `V1__initial_schema.sql` - SQL migration file

### External Resources
- [Spring Data JPA Docs](https://spring.io/projects/spring-data-jpa)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Hibernate Mapping Docs](https://hibernate.org/orm/documentation/)
- [AI/ML for Education](https://www.aied.org/)

---

## 🤝 Team Assignments

- **Backend Lead**: Implement services, APIs, batch jobs
- **Database Admin**: Setup PostgreSQL, migrations, performance tuning
- **Frontend Lead**: Dashboard components, forms, analytics
- **QA Lead**: Testing strategy, test cases, automation
- **DevOps Lead**: Docker, CI/CD, monitoring, deployment
- **ML Engineer**: AI model development, integration

---

**Document Version**: 1.0  
**Last Updated**: January 28, 2026  
**Status**: ✅ Ready for Implementation
