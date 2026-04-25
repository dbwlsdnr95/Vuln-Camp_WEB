package com.vulnlab.web.repository;

import com.vulnlab.web.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CardRepository extends JpaRepository<Card, Long> {
    List<Card> findByUsername(String username);
}
