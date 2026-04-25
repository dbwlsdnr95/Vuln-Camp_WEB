package com.vulnlab.web.controller;

import com.vulnlab.web.model.Product;
import com.vulnlab.web.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/order")
public class OrderController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/buy")
    public String buyProduct(
            @RequestParam("id") Long id,
            @RequestParam(value = "qty", required = false, defaultValue = "1") int qty,
            Model model) {

        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return "redirect:/home";
        }

        int price = product.getPrice();
        String name = product.getName();

        model.addAttribute("productId", id);
        model.addAttribute("productName", name);
        model.addAttribute("price", price);
        model.addAttribute("qty", qty);
        model.addAttribute("totalPrice", price * qty);

        return "order/buy";
    }

    @PostMapping("/submit")
    public String submitOrder() {
        return "order/success";
    }
}
