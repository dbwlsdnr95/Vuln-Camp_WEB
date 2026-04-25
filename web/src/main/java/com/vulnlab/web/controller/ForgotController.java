package com.vulnlab.web.controller;

import com.vulnlab.web.model.User;
import com.vulnlab.web.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ForgotController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/forgot")
    public String forgotPage() {
        return "forgot/forgot";   // templates/forgot/forgot.html
    }

    @PostMapping("/forgot")
    public String findPassword(@RequestParam String username, Model model) {

        User user = userRepository.findByUsername(username);

        if (user == null) {
            model.addAttribute("msg", "해당 아이디로 가입된 사용자가 없습니다.");
            return "login/login_fail";
        }

        // 취약점 실습용: 비밀번호 그대로 노출
        model.addAttribute("msg", "회원님의 비밀번호는: " + user.getPassword());

        return "login/login_success";
    }
}
