package com.magicbus.controller.auth;

import com.magicbus.dto.auth.PermissionDTO;
import com.magicbus.dto.auth.RoleDTO;
import com.magicbus.service.auth.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/roles")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    // Role endpoints
    @GetMapping
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @GetMapping("/active")
    public ResponseEntity<List<RoleDTO>> getActiveRoles() {
        return ResponseEntity.ok(roleService.getActiveRoles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleDTO> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }

    @PostMapping
    public ResponseEntity<RoleDTO> createRole(@RequestBody RoleDTO roleDTO) {
        return ResponseEntity.ok(roleService.createRole(roleDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<RoleDTO> updateRole(@PathVariable Long id, @RequestBody RoleDTO roleDTO) {
        return ResponseEntity.ok(roleService.updateRole(id, roleDTO));
    }

    @PutMapping("/{id}/permissions")
    public ResponseEntity<RoleDTO> updateRolePermissions(
            @PathVariable Long id, 
            @RequestBody List<String> permissionCodes) {
        return ResponseEntity.ok(roleService.updateRolePermissions(id, permissionCodes));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleService.deleteRole(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<Void> toggleRoleStatus(@PathVariable Long id) {
        roleService.toggleRoleStatus(id);
        return ResponseEntity.noContent().build();
    }

    // Permission endpoints
    @GetMapping("/permissions")
    public ResponseEntity<List<PermissionDTO>> getAllPermissions() {
        return ResponseEntity.ok(roleService.getAllPermissions());
    }

    @GetMapping("/permissions/active")
    public ResponseEntity<List<PermissionDTO>> getActivePermissions() {
        return ResponseEntity.ok(roleService.getActivePermissions());
    }

    @GetMapping("/permissions/grouped")
    public ResponseEntity<Map<String, List<PermissionDTO>>> getPermissionsGroupedByModule() {
        return ResponseEntity.ok(roleService.getPermissionsGroupedByModule());
    }
}
