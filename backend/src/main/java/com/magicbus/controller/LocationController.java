package com.magicbus.controller;

import com.magicbus.dto.StateDTO;
import com.magicbus.dto.CityDTO;
import com.magicbus.service.LocationService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/locations")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
@AllArgsConstructor
public class LocationController {

    private final LocationService locationService;

    // ==================== STATE ENDPOINTS ====================

    @GetMapping("/states")
    public ResponseEntity<List<StateDTO>> getAllStates() {
        return ResponseEntity.ok(locationService.getAllStates());
    }

    @GetMapping("/states/active")
    public ResponseEntity<List<StateDTO>> getActiveStates() {
        return ResponseEntity.ok(locationService.getActiveStates());
    }

    @GetMapping("/states/{id}")
    public ResponseEntity<StateDTO> getStateById(@PathVariable Long id) {
        return ResponseEntity.ok(locationService.getStateById(id));
    }

    @GetMapping("/states/code/{code}")
    public ResponseEntity<StateDTO> getStateByCode(@PathVariable String code) {
        return ResponseEntity.ok(locationService.getStateByCode(code));
    }

    @GetMapping("/states/search")
    public ResponseEntity<List<StateDTO>> searchStates(@RequestParam String q) {
        return ResponseEntity.ok(locationService.searchStates(q));
    }

    @PostMapping("/states")
    public ResponseEntity<StateDTO> createState(@RequestBody StateDTO dto) {
        return new ResponseEntity<>(locationService.createState(dto), HttpStatus.CREATED);
    }

    @PutMapping("/states/{id}")
    public ResponseEntity<StateDTO> updateState(@PathVariable Long id, @RequestBody StateDTO dto) {
        return ResponseEntity.ok(locationService.updateState(id, dto));
    }

    @DeleteMapping("/states/{id}")
    public ResponseEntity<Void> deleteState(@PathVariable Long id) {
        locationService.deleteState(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== CITY ENDPOINTS ====================

    @GetMapping("/cities")
    public ResponseEntity<List<CityDTO>> getAllCities() {
        return ResponseEntity.ok(locationService.getAllCities());
    }

    @GetMapping("/cities/active")
    public ResponseEntity<List<CityDTO>> getActiveCities() {
        return ResponseEntity.ok(locationService.getActiveCities());
    }

    @GetMapping("/cities/state/{stateId}")
    public ResponseEntity<List<CityDTO>> getCitiesByState(@PathVariable Long stateId) {
        return ResponseEntity.ok(locationService.getCitiesByState(stateId));
    }

    @GetMapping("/cities/state/{stateId}/active")
    public ResponseEntity<List<CityDTO>> getActiveCitiesByState(@PathVariable Long stateId) {
        return ResponseEntity.ok(locationService.getActiveCitiesByState(stateId));
    }

    @GetMapping("/cities/{id}")
    public ResponseEntity<CityDTO> getCityById(@PathVariable Long id) {
        return ResponseEntity.ok(locationService.getCityById(id));
    }

    @GetMapping("/cities/search")
    public ResponseEntity<List<CityDTO>> searchCities(@RequestParam String q) {
        return ResponseEntity.ok(locationService.searchCities(q));
    }

    @PostMapping("/cities")
    public ResponseEntity<CityDTO> createCity(@RequestBody CityDTO dto) {
        return new ResponseEntity<>(locationService.createCity(dto), HttpStatus.CREATED);
    }

    @PutMapping("/cities/{id}")
    public ResponseEntity<CityDTO> updateCity(@PathVariable Long id, @RequestBody CityDTO dto) {
        return ResponseEntity.ok(locationService.updateCity(id, dto));
    }

    @DeleteMapping("/cities/{id}")
    public ResponseEntity<Void> deleteCity(@PathVariable Long id) {
        locationService.deleteCity(id);
        return ResponseEntity.noContent().build();
    }
}
