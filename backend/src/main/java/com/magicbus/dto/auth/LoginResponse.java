package com.magicbus.dto.auth;

import lombok.*;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {
    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String roleName;
    private Long stateId;
    private String stateName;
    private Long cityId;
    private String cityName;
    private List<String> permissions;
    private String token;
    private String message;
}
