package com.vulnlab.web.controller;

import com.vulnlab.web.model.User;
import com.vulnlab.web.model.Product;
import com.vulnlab.web.repository.UserRepository;
import com.vulnlab.web.repository.ProductRepository;
import com.vulnlab.web.repository.OrderRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.stream.Collectors;

@Controller
public class VulnController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping("/")
    public String index() {
        return "redirect:/home";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login/login";
    }

    @PostMapping("/login")
    public String loginProc(@RequestParam String username,
                            @RequestParam String password,
                            HttpSession session,
                            Model model) {

        User user = userRepository.findByUsername(username);

        if (user != null && user.getPassword().equals(password)) {
            session.setAttribute("loginUser", user.getUsername());
            return "redirect:/home";
        }

        model.addAttribute("msg", "아이디 또는 비밀번호가 잘못되었습니다.");
        return "login/login";
    }

    @GetMapping("/logout")
    public String logout(HttpSession session) {
        session.invalidate();
        return "redirect:/home";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register/register";
    }

    @PostMapping("/register")
    public String registerSubmit(@RequestParam String username,
                                 @RequestParam String password,
                                 Model model) {

        User newUser = new User(username, password);
        userRepository.save(newUser);

        model.addAttribute("msg", "회원가입 완료! 로그인 해주세요.");
        return "login/login";
    }

    @GetMapping("/home")
    public String home(Model model) {
        model.addAttribute("products",
                productRepository.findAll().stream().limit(6).collect(Collectors.toList()));
        return "home/home";
    }

    @GetMapping("/product/list")
    public String list(Model model) {
        model.addAttribute("products", productRepository.findAll());
        return "product/list";
    }

    @GetMapping("/product/detail")
    public String detail(@RequestParam Long id, Model model) {
        Product product = productRepository.findById(id).orElse(null);
        model.addAttribute("product", product);
        return "product/detail";
    }

    @GetMapping("/vuln/p1")
    public String vulnProblem1() {
        return "vuln/p1";
    }

    @GetMapping("/vuln/p1/list")
    public String vulnProblem1List(Model model) {
        model.addAttribute("products", productRepository.findAll());
        return "vuln/p1_list";
    }

    @GetMapping("/vuln/p1/order/{id}")
    public String orderPage(@PathVariable Long id, Model model) {

        Product product = productRepository.findById(id).orElse(null);

        if (product == null) {
            return "redirect:/vuln/p1/list";
        }

        model.addAttribute("product", product);
        return "vuln/order";
    }

    @GetMapping("/mypage")
    public String mypage(HttpSession session, Model model) {
        String username = (String) session.getAttribute("loginUser");
        if (username == null) {
            return "redirect:/login";
        }

        model.addAttribute("orders", orderRepository.findByUsername(username));
        return "user/mypage";
    }
}
