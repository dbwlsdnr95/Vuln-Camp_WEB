package com.vulnlab.web.repository;

import com.vulnlab.web.model.Qna;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QnaRepository extends JpaRepository<Qna, Long> {
    List<Qna> findAllByOrderByCreatedAtDesc();

    boolean existsByTitle(String title);
}
