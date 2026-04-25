package com.vulnlab.web.controller;

import com.vulnlab.web.model.Product;
import com.vulnlab.web.model.CartItem;
import com.vulnlab.web.repository.ProductRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@Controller
public class CartController {

    private final ProductRepository productRepository;

    public CartController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // 장바구니 페이지 출력
    @GetMapping("/cart")
    public String viewCart(HttpSession session, Model model) {

        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");
        if (cart == null) {
            cart = new ArrayList<>();
        }

        // 총 가격 계산
        int total = cart.stream()
                .mapToInt(c -> c.getProduct().getPrice() * c.getQuantity())
                .sum();

        model.addAttribute("cart", cart);
        model.addAttribute("total", total);

        return "cart/cart"; // templates/cart/cart.html
    }

    // 장바구니 추가
    @GetMapping("/cart/add")
    public String addToCart(@RequestParam Long id, HttpSession session) {

        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");
        if (cart == null) {
            cart = new ArrayList<>();
        }

        Product product = productRepository.findById(id).orElse(null);
        if (product == null)
            return "redirect:/cart";

        // 이미 있으면 +1
        for (CartItem item : cart) {
            if (item.getProduct().getId().equals(id)) {
                item.setQuantity(item.getQuantity() + 1);
                session.setAttribute("cart", cart);
                return "redirect:/cart";
            }
        }

        // 새 상품이면 추가
        cart.add(new CartItem(product, 1));
        session.setAttribute("cart", cart);
        return "redirect:/cart";
    }

    // 수량 증가
    @GetMapping("/cart/increase")
    public String increase(@RequestParam Long id, HttpSession session) {

        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");

        for (CartItem item : cart) {
            if (item.getProduct().getId().equals(id)) {
                item.setQuantity(item.getQuantity() + 1);
                break;
            }
        }

        session.setAttribute("cart", cart);
        return "redirect:/cart";
    }

    // 수량 감소
    @GetMapping("/cart/decrease")
    public String decrease(@RequestParam Long id, HttpSession session) {

        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");

        for (CartItem item : cart) {
            if (item.getProduct().getId().equals(id)) {
                if (item.getQuantity() > 1) {
                    item.setQuantity(item.getQuantity() - 1);
                }
                break;
            }
        }

        session.setAttribute("cart", cart);
        return "redirect:/cart";
    }

    // 삭제
    @GetMapping("/cart/delete")
    public String delete(@RequestParam Long id, HttpSession session) {

        List<CartItem> cart = (List<CartItem>) session.getAttribute("cart");

        if (cart != null) {
            cart.removeIf(item -> item.getProduct().getId().equals(id));
            session.setAttribute("cart", cart);
        }
        return "redirect:/cart";
    }
}
