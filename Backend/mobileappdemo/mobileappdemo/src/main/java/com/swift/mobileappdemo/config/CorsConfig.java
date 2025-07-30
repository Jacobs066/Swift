package com.swift.mobileappdemo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(
                    "*",  // Allow all origins for development
                    "http://localhost:*",
                    "http://127.0.0.1:*",
                    "http://192.168.*.*:*",  // Local network devices
                    "http://10.0.2.2:*",  // Android emulator
                    "http://10.0.3.2:*",  // Genymotion emulator
                    "exp://*",  // Expo development
                    "exps://*",  // Expo development (secure)
                    "http://*",  // Any HTTP origin
                    "https://*",  // Any HTTPS origin
                    "capacitor://*",  // Capacitor apps
                    "ionic://*",  // Ionic apps
                    "file://*",  // File protocol for mobile apps
                    // Frontend development origins
                    "http://localhost:19000",  // Expo development server
                    "http://localhost:19001",  // Expo development server
                    "http://localhost:19002",  // Expo development server
                    "http://localhost:8081",   // Metro bundler
                    "http://localhost:3000",   // Common React dev server
                    "http://localhost:3001",   // Common React dev server
                    "http://localhost:8080",   // Common dev server
                    "http://localhost:8082",   // Your backend port
                    "http://192.168.137.1:*",  // Your specific network
                    "http://192.168.137.1:19000",  // Expo on your network
                    "http://192.168.137.1:19001",  // Expo on your network
                    "http://192.168.137.1:19002",  // Expo on your network
                    "http://192.168.137.1:8081",   // Metro on your network
                    "http://192.168.137.1:3000",   // React dev on your network
                    "http://192.168.137.1:3001",   // React dev on your network
                    "http://192.168.137.1:8080",   // Dev server on your network
                    "http://192.168.137.1:8082"    // Backend on your network
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD")
                .allowedHeaders("*")
                .exposedHeaders("Authorization", "Content-Type", "X-Requested-With", "Accept", "Origin", "Access-Control-Request-Method", "Access-Control-Request-Headers")
                .allowCredentials(true)
                .maxAge(3600); // 1 hour
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow specific origins and patterns for real devices and frontend
        configuration.setAllowedOriginPatterns(Arrays.asList(
            "*",  // Allow all origins for development
            "http://localhost:*",
            "http://127.0.0.1:*",
            "http://192.168.*.*:*",  // Local network devices (real phones)
            "http://10.0.2.2:*",  // Android emulator
            "http://10.0.3.2:*",  // Genymotion emulator
            "exp://*",  // Expo development
            "exps://*",  // Expo development (secure)
            "http://*",  // Any HTTP origin
            "https://*",  // Any HTTPS origin
            "capacitor://*",  // Capacitor apps
            "ionic://*",  // Ionic apps
            "file://*",  // File protocol for mobile apps
            // Frontend development origins
            "http://localhost:19000",  // Expo development server
            "http://localhost:19001",  // Expo development server
            "http://localhost:19002",  // Expo development server
            "http://localhost:8081",   // Metro bundler
            "http://localhost:3000",   // Common React dev server
            "http://localhost:3001",   // Common React dev server
            "http://localhost:8080",   // Common dev server
            "http://localhost:8082",   // Your backend port
            "http://192.168.137.1:*",  // Your specific network
            "http://192.168.137.1:19000",  // Expo on your network
            "http://192.168.137.1:19001",  // Expo on your network
            "http://192.168.137.1:19002",  // Expo on your network
            "http://192.168.137.1:8081",   // Metro on your network
            "http://192.168.137.1:3000",   // React dev on your network
            "http://192.168.137.1:3001",   // React dev on your network
            "http://192.168.137.1:8080",   // Dev server on your network
            "http://192.168.137.1:8082"    // Backend on your network
        ));
        
        // Allow all HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        
        // Allow all headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Expose specific headers for mobile apps
        configuration.setExposedHeaders(Arrays.asList(
            "Authorization", 
            "Content-Type", 
            "X-Requested-With", 
            "Accept", 
            "Origin", 
            "Access-Control-Request-Method", 
            "Access-Control-Request-Headers"
        ));
        
        // Allow credentials
        configuration.setAllowCredentials(true);
        
        // Set max age
        configuration.setMaxAge(3600L);
        
        // Apply to all URLs
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
} 