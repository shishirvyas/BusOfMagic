package com.magicbus.controller.auth;

import com.magicbus.dto.auth.*;
import com.magicbus.service.auth.AuthService;
import com.magicbus.service.auth.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
@RequiredArgsConstructor
public class AdminController {

    private final AuthService authService;
    private final RoleService roleService;

    // ==================== ADMIN USER MANAGEMENT ====================

    @PostMapping("/users")
    public ResponseEntity<AdminUserDTO> createAdmin(
            @RequestBody CreateAdminRequest request,
            @RequestHeader(value = "X-User-Id", required = false) Long createdById) {
        AdminUserDTO admin = authService.createAdmin(request, createdById);
        return new ResponseEntity<>(admin, HttpStatus.CREATED);
    }

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDTO>> getAllAdmins() {
        return ResponseEntity.ok(authService.getAllAdmins());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserDTO> getAdminById(@PathVariable Long id) {
        return ResponseEntity.ok(authService.getAdminById(id));
    }

    @GetMapping("/users/state/{stateId}")
    public ResponseEntity<List<AdminUserDTO>> getAdminsByState(@PathVariable Long stateId) {
        return ResponseEntity.ok(authService.getAdminsByState(stateId));
    }

    @GetMapping("/users/city/{cityId}")
    public ResponseEntity<List<AdminUserDTO>> getAdminsByCity(@PathVariable Long cityId) {
        return ResponseEntity.ok(authService.getAdminsByCity(cityId));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<AdminUserDTO> updateAdmin(
            @PathVariable Long id,
            @RequestBody CreateAdminRequest request) {
        return ResponseEntity.ok(authService.updateAdmin(id, request));
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<Void> toggleAdminStatus(@PathVariable Long id) {
        authService.toggleAdminStatus(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        authService.deleteAdmin(id);
        return ResponseEntity.noContent().build();
    }

    // ==================== ROLE MANAGEMENT ====================

    @GetMapping("/roles")
    public ResponseEntity<List<RoleDTO>> getAllRoles() {
        return ResponseEntity.ok(roleService.getAllRoles());
    }

    @GetMapping("/roles/active")
    public ResponseEntity<List<RoleDTO>> getActiveRoles() {
        return ResponseEntity.ok(roleService.getActiveRoles());
    }

    @GetMapping("/roles/{id}")
    public ResponseEntity<RoleDTO> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(roleService.getRoleById(id));
    }
}
