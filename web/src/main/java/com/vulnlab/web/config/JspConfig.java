package com.vulnlab.web.config;

import org.apache.catalina.Context;
import org.apache.catalina.WebResourceRoot;
import org.apache.catalina.startup.Tomcat;
import org.apache.catalina.webresources.DirResourceSet;
import org.apache.catalina.webresources.StandardRoot;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.servlet.server.ServletWebServerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.File;

@Configuration
public class JspConfig {

    @Bean
    public ServletWebServerFactory servletContainer() {
        return new TomcatServletWebServerFactory() {
            @Override
            protected void postProcessContext(Context context) {
                // Ensure uploads directory exists
                File uploadsDir = new File("uploads");
                if (!uploadsDir.exists()) {
                    uploadsDir.mkdirs();
                }

                // VULNERABILITY: Map 'uploads' directory as a web resource
                // This makes Tomcat treat files in 'uploads' as if they were in the webapp root
                WebResourceRoot resources = new StandardRoot(context);
                resources.addPreResources(new DirResourceSet(
                        resources, "/uploads", uploadsDir.getAbsolutePath(), "/"));
                context.setResources(resources);

                // Enable Jasper (JSP Engine)
                context.addServletContainerInitializer(
                        new org.apache.jasper.servlet.JasperInitializer(), null);
            }
        };
    }
}
