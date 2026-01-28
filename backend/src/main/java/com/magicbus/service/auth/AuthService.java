package com.magicbus.service.auth;

import com.magicbus.dto.auth.*;
import com.magicbus.entity.auth.AdminUser;
import com.magicbus.entity.auth.Permission;
import com.magicbus.entity.auth.Role;
import com.magicbus.entity.City;
import com.magicbus.entity.State;
import com.magicbus.repository.auth.AdminUserRepository;
import com.magicbus.repository.auth.RoleRepository;
import com.magicbus.repository.CityRepository;
import com.magicbus.repository.StateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final RoleRepository roleRepository;
    private final StateRepository stateRepository;
    private final CityRepository cityRepository;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        AdminUser user = adminUserRepository.findByUsernameAndPassword(
            request.getUsername(), 
            request.getPassword()
        ).orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!user.getIsActive()) {
            throw new RuntimeException("User account is deactivated");
        }

        // Generate simple token (in production, use JWT)
        String token = UUID.randomUUID().toString();

        // Update last login and save token
        user.setLastLogin(LocalDateTime.now());
        user.setAuthToken(token);
        adminUserRepository.save(user);

        // Get permissions from role
        List<String> permissions = user.getRole().getPermissions().stream()
            .filter(Permission::getIsActive)
            .map(Permission::getCode)
            .collect(Collectors.toList());

        return LoginResponse.builder()
            .userId(user.getId())
            .username(user.getUsername())
            .firstName(user.getFirstName())
            .lastName(user.getLastName())
            .email(user.getEmail())
            .roleName(user.getRole().getName())
            .stateId(user.getState() != null ? user.getState().getId() : null)
            .stateName(user.getState() != null ? user.getState().getStateName() : null)
            .cityId(user.getCity() != null ? user.getCity().getId() : null)
            .cityName(user.getCity() != null ? user.getCity().getCityName() : null)
            .permissions(permissions)
            .token(token)
            .message("Login successful")
            .build();
    }

    @Transactional
    public AdminUserDTO createAdmin(CreateAdminRequest request, Long createdById) {
        // Validate username doesn't exist
        if (adminUserRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Get role
        Role role = roleRepository.findById(request.getRoleId())
            .orElseThrow(() -> new RuntimeException("Role not found"));

        // Get state if provided
        State state = null;
        if (request.getStateId() != null) {
            state = stateRepository.findById(request.getStateId())
                .orElseThrow(() -> new RuntimeException("State not found"));
        }

        // Get city if provided
        City city = null;
        if (request.getCityId() != null) {
            city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new RuntimeException("City not found"));
        }

        // Get creator
        AdminUser createdBy = null;
        if (createdById != null) {
            createdBy = adminUserRepository.findById(createdById).orElse(null);
        }

        AdminUser admin = AdminUser.builder()
            .username(request.getUsername())
            .password(request.getPassword()) // Plain text as requested
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .email(request.getEmail())
            .phone(request.getPhone())
            .role(role)
            .state(state)
            .city(city)
            .isActive(true)
            .createdBy(createdBy)
            .build();

        admin = adminUserRepository.save(admin);
        return mapToDTO(admin);
    }

    public AdminUserDTO getAdminById(Long id) {
        AdminUser admin = adminUserRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found"));
        return mapToDTO(admin);
    }

    public List<AdminUserDTO> getAllAdmins() {
        return adminUserRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public List<AdminUserDTO> getAdminsByState(Long stateId) {
        return adminUserRepository.findByStateId(stateId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public List<AdminUserDTO> getAdminsByCity(Long cityId) {
        return adminUserRepository.findByCityId(cityId).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserDTO updateAdmin(Long id, CreateAdminRequest request) {
        AdminUser admin = adminUserRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (request.getFirstName() != null) admin.setFirstName(request.getFirstName());
        if (request.getLastName() != null) admin.setLastName(request.getLastName());
        if (request.getEmail() != null) admin.setEmail(request.getEmail());
        if (request.getPhone() != null) admin.setPhone(request.getPhone());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            admin.setPassword(request.getPassword());
        }

        if (request.getRoleId() != null) {
            Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
            admin.setRole(role);
        }

        if (request.getStateId() != null) {
            State state = stateRepository.findById(request.getStateId())
                .orElseThrow(() -> new RuntimeException("State not found"));
            admin.setState(state);
        }

        if (request.getCityId() != null) {
            City city = cityRepository.findById(request.getCityId())
                .orElseThrow(() -> new RuntimeException("City not found"));
            admin.setCity(city);
        }

        admin = adminUserRepository.save(admin);
        return mapToDTO(admin);
    }

    @Transactional
    public void toggleAdminStatus(Long id) {
        AdminUser admin = adminUserRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Admin not found"));
        admin.setIsActive(!admin.getIsActive());
        adminUserRepository.save(admin);
    }

    @Transactional
    public void deleteAdmin(Long id) {
        if (!adminUserRepository.existsById(id)) {
            throw new RuntimeException("Admin not found");
        }
        adminUserRepository.deleteById(id);
    }

    private AdminUserDTO mapToDTO(AdminUser admin) {
        List<String> permissions = admin.getRole().getPermissions().stream()
            .filter(Permission::getIsActive)
            .map(Permission::getCode)
            .collect(Collectors.toList());

        return AdminUserDTO.builder()
            .id(admin.getId())
            .username(admin.getUsername())
            .firstName(admin.getFirstName())
            .lastName(admin.getLastName())
            .email(admin.getEmail())
            .phone(admin.getPhone())
            .roleId(admin.getRole().getId())
            .roleName(admin.getRole().getName())
            .stateId(admin.getState() != null ? admin.getState().getId() : null)
            .stateName(admin.getState() != null ? admin.getState().getStateName() : null)
            .cityId(admin.getCity() != null ? admin.getCity().getId() : null)
            .cityName(admin.getCity() != null ? admin.getCity().getCityName() : null)
            .isActive(admin.getIsActive())
            .lastLogin(admin.getLastLogin())
            .createdById(admin.getCreatedBy() != null ? admin.getCreatedBy().getId() : null)
            .createdByName(admin.getCreatedBy() != null ? 
                admin.getCreatedBy().getFirstName() + " " + admin.getCreatedBy().getLastName() : null)
            .createdAt(admin.getCreatedAt())
            .permissions(permissions)
            .build();
    }
}
