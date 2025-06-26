package com.swift.mobileappdemo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.swift"})
@EntityScan(basePackages = {"com.swift.auth.models", "com.swift.wallet.models"})
@EnableJpaRepositories(basePackages = {"com.swift.auth.repository", "com.swift.wallet.repository"})
public class MobileappdemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(MobileappdemoApplication.class, args);
	}

}


