package com.magicbus.service;

import com.magicbus.dto.StateDTO;
import com.magicbus.dto.CityDTO;
import com.magicbus.entity.State;
import com.magicbus.entity.City;
import com.magicbus.repository.StateRepository;
import com.magicbus.repository.CityRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class LocationService {

    private final StateRepository stateRepository;
    private final CityRepository cityRepository;

    // ==================== STATE OPERATIONS ====================

    public List<StateDTO> getAllStates() {
        return stateRepository.findAllByOrderByStateName()
            .stream()
            .map(this::convertStateToDTO)
            .collect(Collectors.toList());
    }

    public List<StateDTO> getActiveStates() {
        return stateRepository.findByIsActiveTrueOrderByStateName()
            .stream()
            .map(this::convertStateToDTO)
            .collect(Collectors.toList());
    }

    public StateDTO getStateById(Long id) {
        return stateRepository.findById(id)
            .map(this::convertStateToDTO)
            .orElseThrow(() -> new RuntimeException("State not found with id: " + id));
    }

    public StateDTO getStateByCode(String code) {
        return stateRepository.findByStateCode(code)
            .map(this::convertStateToDTO)
            .orElseThrow(() -> new RuntimeException("State not found with code: " + code));
    }

    @Transactional
    public StateDTO createState(StateDTO dto) {
        if (stateRepository.existsByStateCode(dto.getStateCode())) {
            throw new RuntimeException("State code already exists: " + dto.getStateCode());
        }
        if (stateRepository.existsByStateName(dto.getStateName())) {
            throw new RuntimeException("State name already exists: " + dto.getStateName());
        }
        
        State state = State.builder()
            .stateCode(dto.getStateCode().toUpperCase())
            .stateName(dto.getStateName())
            .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
            .build();
        
        return convertStateToDTO(stateRepository.save(state));
    }

    @Transactional
    public StateDTO updateState(Long id, StateDTO dto) {
        State state = stateRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("State not found with id: " + id));
        
        // Check if code is being changed to an existing one
        if (!state.getStateCode().equals(dto.getStateCode()) && 
            stateRepository.existsByStateCode(dto.getStateCode())) {
            throw new RuntimeException("State code already exists: " + dto.getStateCode());
        }
        
        // Check if name is being changed to an existing one
        if (!state.getStateName().equals(dto.getStateName()) && 
            stateRepository.existsByStateName(dto.getStateName())) {
            throw new RuntimeException("State name already exists: " + dto.getStateName());
        }
        
        state.setStateCode(dto.getStateCode().toUpperCase());
        state.setStateName(dto.getStateName());
        if (dto.getIsActive() != null) {
            state.setIsActive(dto.getIsActive());
        }
        
        return convertStateToDTO(stateRepository.save(state));
    }

    @Transactional
    public void deleteState(Long id) {
        if (!stateRepository.existsById(id)) {
            throw new RuntimeException("State not found with id: " + id);
        }
        stateRepository.deleteById(id);
    }

    public List<StateDTO> searchStates(String search) {
        return stateRepository.searchStates(search)
            .stream()
            .map(this::convertStateToDTO)
            .collect(Collectors.toList());
    }

    // ==================== CITY OPERATIONS ====================

    public List<CityDTO> getAllCities() {
        return cityRepository.findAllByOrderByCityName()
            .stream()
            .map(this::convertCityToDTO)
            .collect(Collectors.toList());
    }

    public List<CityDTO> getActiveCities() {
        return cityRepository.findByIsActiveTrueOrderByCityName()
            .stream()
            .map(this::convertCityToDTO)
            .collect(Collectors.toList());
    }

    public List<CityDTO> getCitiesByState(Long stateId) {
        return cityRepository.findByStateIdOrderByCityName(stateId)
            .stream()
            .map(this::convertCityToDTO)
            .collect(Collectors.toList());
    }

    public List<CityDTO> getActiveCitiesByState(Long stateId) {
        return cityRepository.findByStateIdAndIsActiveTrueOrderByCityName(stateId)
            .stream()
            .map(this::convertCityToDTO)
            .collect(Collectors.toList());
    }

    public CityDTO getCityById(Long id) {
        return cityRepository.findById(id)
            .map(this::convertCityToDTO)
            .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
    }

    @Transactional
    public CityDTO createCity(CityDTO dto) {
        if (cityRepository.existsByCityNameAndStateId(dto.getCityName(), dto.getStateId())) {
            throw new RuntimeException("City already exists in this state: " + dto.getCityName());
        }
        
        State state = stateRepository.findById(dto.getStateId())
            .orElseThrow(() -> new RuntimeException("State not found with id: " + dto.getStateId()));
        
        City city = City.builder()
            .cityName(dto.getCityName())
            .state(state)
            .pincode(dto.getPincode())
            .isActive(dto.getIsActive() != null ? dto.getIsActive() : true)
            .build();
        
        return convertCityToDTO(cityRepository.save(city));
    }

    @Transactional
    public CityDTO updateCity(Long id, CityDTO dto) {
        City city = cityRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("City not found with id: " + id));
        
        // Check if city name is being changed to an existing one in the same state
        if (!city.getCityName().equals(dto.getCityName()) && 
            cityRepository.existsByCityNameAndStateId(dto.getCityName(), dto.getStateId())) {
            throw new RuntimeException("City already exists in this state: " + dto.getCityName());
        }
        
        State state = stateRepository.findById(dto.getStateId())
            .orElseThrow(() -> new RuntimeException("State not found with id: " + dto.getStateId()));
        
        city.setCityName(dto.getCityName());
        city.setState(state);
        city.setPincode(dto.getPincode());
        if (dto.getIsActive() != null) {
            city.setIsActive(dto.getIsActive());
        }
        
        return convertCityToDTO(cityRepository.save(city));
    }

    @Transactional
    public void deleteCity(Long id) {
        if (!cityRepository.existsById(id)) {
            throw new RuntimeException("City not found with id: " + id);
        }
        cityRepository.deleteById(id);
    }

    public List<CityDTO> searchCities(String search) {
        return cityRepository.searchCities(search)
            .stream()
            .map(this::convertCityToDTO)
            .collect(Collectors.toList());
    }

    // ==================== CONVERSION METHODS ====================

    private StateDTO convertStateToDTO(State state) {
        Integer cityCount = cityRepository.countByStateId(state.getId());
        return StateDTO.builder()
            .id(state.getId())
            .stateCode(state.getStateCode())
            .stateName(state.getStateName())
            .isActive(state.getIsActive())
            .createdAt(state.getCreatedAt())
            .updatedAt(state.getUpdatedAt())
            .cityCount(cityCount)
            .build();
    }

    private CityDTO convertCityToDTO(City city) {
        return CityDTO.builder()
            .id(city.getId())
            .cityName(city.getCityName())
            .stateId(city.getState().getId())
            .stateName(city.getState().getStateName())
            .stateCode(city.getState().getStateCode())
            .pincode(city.getPincode())
            .isActive(city.getIsActive())
            .createdAt(city.getCreatedAt())
            .updatedAt(city.getUpdatedAt())
            .build();
    }
}
