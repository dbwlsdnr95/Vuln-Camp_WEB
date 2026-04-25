package com.vulnlab.web.controller;

import com.vulnlab.web.model.User;
import com.vulnlab.web.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 비밀번호 변경 로직
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@CookieValue(value = "VULN_USER", defaultValue = "") String username,
            @RequestBody Map<String, String> body) {
        if (username.isEmpty()) {
            return ResponseEntity.status(401).body("로그인이 필요합니다.");
        }

        String newPassword = body.get("password");
        if (newPassword == null || newPassword.length() < 4) {
            return ResponseEntity.badRequest().body("비밀번호는 4자 이상이어야 합니다.");
        }

        User user = userRepository.findByUsername(username);
        if (user != null) {
            user.setPassword(newPassword);
            userRepository.save(user);
            return ResponseEntity.ok("비밀번호가 변경되었습니다.");
        } else {
            return ResponseEntity.status(404).body("사용자를 찾을 수 없습니다.");
        }
    }
}
