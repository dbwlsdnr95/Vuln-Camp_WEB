package com.vulnlab.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/upload")
public class UploadController {

    // 파일 업로드 핸들러
    @PostMapping
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("파일이 비어있습니다.");
        }

        try {
            // 로컬 업로드 디렉토리에 저장
            String uploadsDir = "uploads";
            Path uploadPath = Paths.get(uploadsDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String filename = file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);

            file.transferTo(filePath.toFile());

            Map<String, String> response = new HashMap<>();
            response.put("message", "파일 업로드 성공");
            response.put("url", "/uploads/" + filename);

            return ResponseEntity.ok(response);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("업로드 중 오류가 발생했습니다.");
        }
    }
}
