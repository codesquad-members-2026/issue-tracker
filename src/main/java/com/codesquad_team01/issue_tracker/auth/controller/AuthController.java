package com.codesquad_team01.issue_tracker.auth.controller;

import com.codesquad_team01.issue_tracker.auth.dto.request.LoginRequest;
import com.codesquad_team01.issue_tracker.auth.dto.response.GithubLoginResponse;
import com.codesquad_team01.issue_tracker.auth.service.AuthService;
import com.codesquad_team01.issue_tracker.global.dto.ApiResponse;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/login/github")
    public ApiResponse<GithubLoginResponse> login (@RequestBody LoginRequest loginRequest){
        String code = loginRequest.code();
        GithubLoginResponse githubLoginResponse = authService.login(code);
        return ApiResponse.success("로그인 성공", githubLoginResponse);
    }
}
