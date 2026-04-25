package com.vulnlab.web.model;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")   // 🔥 예약어 충돌 방지 필수!
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;      // 구매한 사용자
    private String productName;   // 상품명
    private int price;            // 결제된 가격
    private String imageUrl;      // 상품 이미지
    private LocalDateTime createdAt; // 구매 시간

    public Order() {}

    public Order(String username, String productName, int price, String imageUrl) {
        this.username = username;
        this.productName = productName;
        this.price = price;
        this.imageUrl = imageUrl;
        this.createdAt = LocalDateTime.now();
    }

    // Getter & Setter
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getProductName() { return productName; }
    public int getPrice() { return price; }
    public String getImageUrl() { return imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setProductName(String productName) { this.productName = productName; }
    public void setPrice(int price) { this.price = price; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
