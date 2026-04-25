package com.vulnlab.web;

import com.vulnlab.web.model.Product;
import com.vulnlab.web.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class VulnWebApplication {

    @Autowired
    private ProductRepository productRepository;

    public static void main(String[] args) {
        SpringApplication.run(VulnWebApplication.class, args);
    }

    @Bean
    CommandLineRunner initData() {
        return args -> {

            if (productRepository.count() == 0) {

                productRepository.save(new Product("울트라 돔 텐트", 199000, "/img/dom.jpg"));
                productRepository.save(new Product("컴포트 체어 라이트", 69000, "/img/compote.jpg"));
                productRepository.save(new Product("와일드 라이트 랜턴", 49000, "/img/wild.jpg"));
                productRepository.save(new Product("프리미엄 침낭", 109000, "/img/bed.jpg"));
                productRepository.save(new Product("하이킹 백팩 45L", 159000, "/img/bak.jpg"));
                productRepository.save(new Product("화로대", 35000, "/img/fire.jpg"));
            }
        };
    }

}
