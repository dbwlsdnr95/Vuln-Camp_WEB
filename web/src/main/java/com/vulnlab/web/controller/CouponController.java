package com.vulnlab.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    // 쿠폰 목록
    @GetMapping
    public List<Map<String, Object>> getCoupons() {
        return new ArrayList<>();
    }

    @PostMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestBody Map<String, String> body) {
        String code = body.get("code");

        // 쿠폰 패턴 검증
        if (code != null && code.startsWith("jinwk")) {
            try {
                int day = java.time.LocalDate.now().getDayOfMonth();
                int magic = day * 31337;
                String expectedSuffix = Integer.toHexString(magic);
                String expectedCode = "jinwk" + expectedSuffix;

                if (expectedCode.equalsIgnoreCase(code)) {
                    java.util.Map<String, Object> response = new java.util.HashMap<>();
                    response.put("valid", true);
                    response.put("discount", 10);
                    return ResponseEntity.ok(response);
                }
            } catch (Exception e) {
                // Ignore
            }
        }

        java.util.Map<String, String> errorResponse = new java.util.HashMap<>();
        errorResponse.put("message", "유효하지 않은 쿠폰입니다.");
        return ResponseEntity.badRequest().body(errorResponse);
    }
}
