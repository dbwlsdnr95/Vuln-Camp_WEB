package com.vulnlab.web.controller;

import com.vulnlab.web.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @PersistenceContext
    private EntityManager entityManager;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");

        User user = userRepository.findByUsername(username);

        if (user != null) {

            if (user.getPassword().equals(password)) {

                // 관리자 계정 확인 (Admin 권한 부여)
                String role = "user";
                if ("admin@vuln.camp".equals(user.getUsername())) {
                    role = "admin";
                }

                return ResponseEntity.ok()
                        .header("Set-Cookie", "VULN_ROLE=" + role + "; Path=/")
                        .header("Set-Cookie", "VULN_USER=" + user.getUsername() + "; Path=/")
                        .body(java.util.Collections.singletonMap("message", "Login successful"));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
    }

    // 현재 로그인 역할 조회
    @GetMapping("/role")
    public ResponseEntity<?> checkRole(@CookieValue(value = "VULN_ROLE", defaultValue = "guest") String role) {
        Map<String, String> response = new HashMap<>();
        response.put("role", role);
        if ("admin".equals(role)) {
            response.put("message", "Welcome, Administrator!");
            response.put("flag", "FLAG{COOKIE_TAMPERING_SUCCESS}");
        } else {
            response.put("message", "Welcome, User.");
        }
        return ResponseEntity.ok(response);
    }

    @Autowired
    private com.vulnlab.web.repository.UserRepository userRepository;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        try {
            if (userRepository.findByUsername(user.getUsername()) != null) {
                return ResponseEntity.badRequest().body("이미 존재하는 사용자입니다.");
            }
            userRepository.save(user);
            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("회원가입 중 오류가 발생했습니다.");
        }
    }
}
