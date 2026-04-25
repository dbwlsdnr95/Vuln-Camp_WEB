package com.vulnlab.web.controller;

import com.vulnlab.web.model.Qna;
import com.vulnlab.web.repository.QnaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import javax.persistence.PersistenceContext;

@RestController
@RequestMapping("/api/qna")
public class QnaController {

    @Autowired
    private QnaRepository qnaRepository;

    @GetMapping
    public List<Qna> getAllQna() {
        return qnaRepository.findAllByOrderByCreatedAtDesc();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Qna> getQnaById(@PathVariable Long id) {
        return qnaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 게시글 작성 및 파일 업로드
    @PostMapping
    public Qna createQna(
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam("author") String author,
            @RequestParam(value = "file", required = false) MultipartFile file) {

        Qna qna = new Qna();

        // 제목, 작성자 특수문자 제거
        String sanitizePattern = "['\"<>()]";
        qna.setTitle(title.replaceAll(sanitizePattern, ""));
        qna.setAuthor(author.replaceAll(sanitizePattern, ""));

        // 본문 XSS 필터링 (<script> 태그만 제거)
        if (content != null) {
            String filtered = content.replaceAll("(?i)<script>", "");
            qna.setContent(filtered);
        }

        // 첨부파일 저장
        if (file != null && !file.isEmpty()) {
            try {
                String uploadsDir = "uploads/qna";
                Path uploadPath = Paths.get(uploadsDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                String filename = System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = uploadPath.resolve(filename);
                Files.copy(file.getInputStream(), filePath);
                qna.setAttachmentPath(filename);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return qnaRepository.save(qna);
    }

    // 파일 다운로드 처리
    @GetMapping("/download")
    public ResponseEntity<Resource> downloadFile(@RequestParam String filename) {
        try {
            // 파일 경로 설정
            Path path = Paths.get("uploads/qna").resolve(filename);
            Resource resource = new UrlResource(path.toUri());

            if (resource.exists() || resource.isReadable()) {
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION,
                                "attachment; filename=\"" + resource.getFilename() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PersistenceContext
    private javax.persistence.EntityManager entityManager;

    // 기간별 데이터 조회
    @GetMapping("/search")
    public List<Qna> searchQnaByDateRange(@RequestParam String startDate, @RequestParam String endDate) {
        // VULNERABILITY: user-controlled date parameters are concatenated into SQL.
        // FORMATDATETIME is used so the date search works with the local H2 database.
        String sql = "SELECT * FROM VULN_QNA WHERE FORMATDATETIME(created_at, 'yyyy-MM-dd') >= '" + startDate
                + "' AND FORMATDATETIME(created_at, 'yyyy-MM-dd') <= '" + endDate
                + "' ORDER BY created_at DESC";

        System.out.println("DEBUG SQL: " + sql);

        try {
            javax.persistence.Query query = entityManager.createNativeQuery(sql, Qna.class);
            return query.getResultList();
        } catch (Exception e) {
            System.out.println("SQL Exec Error: " + e.getMessage());
            return java.util.Collections.emptyList();
        }
    }

    // 키워드 검색 (제목/작성자)
    @GetMapping("/search/keyword")
    public List<Qna> searchQnaByKeyword(@RequestParam String keyword) {
        String sql = "SELECT * FROM VULN_QNA WHERE title LIKE :keyword OR author LIKE :keyword";

        System.out.println("DEBUG SQL (Keyword): " + sql);

        try {
            javax.persistence.Query query = entityManager.createNativeQuery(sql, Qna.class);
            query.setParameter("keyword", "%" + keyword + "%");
            return query.getResultList();
        } catch (Exception e) {
            e.printStackTrace();
            return java.util.Collections.emptyList();
        }
    }

    // 게시글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteQna(@PathVariable Long id,
            @CookieValue(value = "VULN_ROLE", defaultValue = "guest") String role) {

        // 관리자 권한 확인
        if (!"admin".equals(role)) {
            return ResponseEntity.status(403).body("Access Denied: You are not an admin.");
        }

        if (qnaRepository.existsById(id)) {
            qnaRepository.deleteById(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
