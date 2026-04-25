package com.vulnlab.web.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.File;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Controller
public class DirectoryListingController {

    private final Path imageLocation = Paths.get("src/main/resources/static/images");

    @GetMapping("/images")
    @ResponseBody
    public String listImages() {
        // 디렉토리 내용 나열
        File folder = imageLocation.toFile();
        if (!folder.exists() || !folder.isDirectory()) {
            // 디렉토리 접근 실패 시 디버그 정보 출력
            String cwd = System.getProperty("user.dir");
            String absPath = folder.getAbsolutePath();
            return "<h3>403 Forbidden</h3><p>Could not find directory.</p>" +
                    "<p>Current Working Directory: " + cwd + "</p>" +
                    "<p>Trying to access: " + absPath + "</p>";
        }

        File[] files = folder.listFiles();
        StringBuilder html = new StringBuilder();
        html.append("<html><head><title>Index of /images</title></head><body>");
        html.append("<h1>Index of /images</h1><hr><pre>");
        html.append("<a href=\"../\">../</a><br>");

        if (files != null) {
            for (File file : files) {
                String name = file.getName();
                html.append("<a href=\"/images/").append(name).append("\">").append(name).append("</a><br>");
            }
        }

        html.append("</pre><hr></body></html>");
        return html.toString();
    }

    // 이미지 파일 제공
    @GetMapping("/images/{filename:.+}")
    @ResponseBody
    public Resource serveFile(@org.springframework.web.bind.annotation.PathVariable String filename) {
        try {
            Path file = imageLocation.resolve(filename);
            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                return null;
            }
        } catch (MalformedURLException e) {
            return null;
        }
    }
}
