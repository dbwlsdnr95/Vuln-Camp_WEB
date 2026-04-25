package com.vulnlab.web.controller;

import com.vulnlab.web.model.Order;
import com.vulnlab.web.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderApiController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    // 주문 정보 저장
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody Order order) {
        orderRepository.save(order);

        return ResponseEntity.ok("Order created successfully");
    }
}
