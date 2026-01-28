package com.magicbus.controller;

import com.magicbus.dto.DashboardDTO;
import com.magicbus.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardDTO> getDashboardStats(
            @RequestParam(defaultValue = "2026") int year) {
        log.info("Fetching dashboard stats for year: {}", year);
        return ResponseEntity.ok(dashboardService.getDashboardStats(year));
    }
    
    @GetMapping("/stats/summary")
    public ResponseEntity<DashboardDTO> getDashboardSummary() {
        log.info("Fetching dashboard summary");
        return ResponseEntity.ok(dashboardService.getDashboardSummary());
    }
}
