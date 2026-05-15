package com.codesquad_team01.issue_tracker.global;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH")
                .allowCredentials(true); // TODO: 추후 JWT를 로컬 스토리지에 두고 헤더에 직접 넣는 방식을 채택할 경우 .allowedHeaders("Authorization")을 추가로 열어야 함 -> 그때가서 공부
    }
}