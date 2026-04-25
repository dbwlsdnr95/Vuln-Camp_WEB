package com.vulnlab.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ssrf")
public class SSRFController {

    // 웹 페이지 미리보기 (Proxy 기능)
    @GetMapping("/fetch")
    public ResponseEntity<?> fetchUrl(@RequestParam String url) {
        try {
            URL targetUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection) targetUrl.openConnection();
            connection.setRequestMethod("GET");

            int status = connection.getResponseCode();

            // 응답 데이터 읽기
            BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String content = in.lines().collect(Collectors.joining("\n"));
            in.close();

            Map<String, Object> response = new HashMap<>();
            response.put("status", status);
            response.put("length", content.length());
            // JSON 파싱 오류 방지를 위해 Base64 인코딩 처리
            response.put("content_preview", content.substring(0, Math.min(content.length(), 200)));
            response.put("content_base64", Base64.getEncoder().encodeToString(content.getBytes()));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching URL: " + e.getMessage());
        }
    }
}
