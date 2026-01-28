package com.magicbus.dto.auth;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleDTO {
    private Long id;
    private String name;
    private String description;
    private Boolean isActive;
    private List<String> permissions;
}
