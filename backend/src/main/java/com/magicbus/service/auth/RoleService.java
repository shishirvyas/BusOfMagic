package com.magicbus.service.auth;

import com.magicbus.dto.auth.PermissionDTO;
import com.magicbus.dto.auth.RoleDTO;
import com.magicbus.entity.auth.Permission;
import com.magicbus.entity.auth.Role;
import com.magicbus.repository.auth.PermissionRepository;
import com.magicbus.repository.auth.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    public List<RoleDTO> getAllRoles() {
        return roleRepository.findAll().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public List<RoleDTO> getActiveRoles() {
        return roleRepository.findByIsActiveTrue().stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    public RoleDTO getRoleById(Long id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Role not found"));
        return mapToDTO(role);
    }

    public RoleDTO getRoleByName(String name) {
        Role role = roleRepository.findByName(name)
            .orElseThrow(() -> new RuntimeException("Role not found"));
        return mapToDTO(role);
    }

    @Transactional
    public RoleDTO createRole(RoleDTO roleDTO) {
        if (roleRepository.findByName(roleDTO.getName()).isPresent()) {
            throw new RuntimeException("Role with name '" + roleDTO.getName() + "' already exists");
        }

        Role role = Role.builder()
            .name(roleDTO.getName())
            .description(roleDTO.getDescription())
            .isActive(roleDTO.getIsActive() != null ? roleDTO.getIsActive() : true)
            .permissions(new HashSet<>())
            .build();

        // Assign permissions if provided
        if (roleDTO.getPermissions() != null && !roleDTO.getPermissions().isEmpty()) {
            Set<Permission> permissions = permissionRepository.findByCodeIn(roleDTO.getPermissions());
            role.setPermissions(permissions);
        }

        role = roleRepository.save(role);
        return mapToDTO(role);
    }

    @Transactional
    public RoleDTO updateRole(Long id, RoleDTO roleDTO) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Role not found"));

        // Check for name uniqueness
        Optional<Role> existingWithName = roleRepository.findByName(roleDTO.getName());
        if (existingWithName.isPresent() && !existingWithName.get().getId().equals(id)) {
            throw new RuntimeException("Role with name '" + roleDTO.getName() + "' already exists");
        }

        role.setName(roleDTO.getName());
        role.setDescription(roleDTO.getDescription());
        if (roleDTO.getIsActive() != null) {
            role.setIsActive(roleDTO.getIsActive());
        }

        role = roleRepository.save(role);
        return mapToDTO(role);
    }

    @Transactional
    public RoleDTO updateRolePermissions(Long roleId, List<String> permissionCodes) {
        Role role = roleRepository.findById(roleId)
            .orElseThrow(() -> new RuntimeException("Role not found"));

        Set<Permission> permissions = permissionRepository.findByCodeIn(permissionCodes);
        role.setPermissions(permissions);

        role = roleRepository.save(role);
        return mapToDTO(role);
    }

    @Transactional
    public void deleteRole(Long id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Role not found"));
        
        // Prevent deletion of system roles
        if (role.getName().equals("SUPER_ADMIN")) {
            throw new RuntimeException("Cannot delete SUPER_ADMIN role");
        }

        roleRepository.delete(role);
    }

    @Transactional
    public void toggleRoleStatus(Long id) {
        Role role = roleRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Role not found"));
        
        role.setIsActive(!role.getIsActive());
        roleRepository.save(role);
    }

    // Permission methods
    public List<PermissionDTO> getAllPermissions() {
        return permissionRepository.findAll().stream()
            .map(this::mapPermissionToDTO)
            .collect(Collectors.toList());
    }

    public List<PermissionDTO> getActivePermissions() {
        return permissionRepository.findByIsActiveTrue().stream()
            .map(this::mapPermissionToDTO)
            .collect(Collectors.toList());
    }

    public Map<String, List<PermissionDTO>> getPermissionsGroupedByModule() {
        List<Permission> permissions = permissionRepository.findByIsActiveTrue();
        return permissions.stream()
            .map(this::mapPermissionToDTO)
            .collect(Collectors.groupingBy(PermissionDTO::getModule));
    }

    private RoleDTO mapToDTO(Role role) {
        List<String> permissions = role.getPermissions().stream()
            .filter(Permission::getIsActive)
            .map(Permission::getCode)
            .collect(Collectors.toList());

        return RoleDTO.builder()
            .id(role.getId())
            .name(role.getName())
            .description(role.getDescription())
            .isActive(role.getIsActive())
            .permissions(permissions)
            .build();
    }

    private PermissionDTO mapPermissionToDTO(Permission permission) {
        return PermissionDTO.builder()
            .id(permission.getId())
            .code(permission.getCode())
            .name(permission.getName())
            .description(permission.getDescription())
            .module(permission.getModule())
            .isActive(permission.getIsActive())
            .build();
    }
}
