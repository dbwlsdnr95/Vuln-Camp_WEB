package com.vulnlab.web.repository;

import com.vulnlab.web.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    // 사용자별 구매기록 여러 개 가능 → 반드시 List 로 받아야 함!!!
    List<Order> findByUsername(String username);
}
