package com.codesquad_team01.issue_tracker.auth.controller;

import com.codesquad_team01.issue_tracker.auth.dto.request.GithubLoginRequest;
import com.codesquad_team01.issue_tracker.auth.dto.request.LoginRequest;
import com.codesquad_team01.issue_tracker.auth.dto.request.SignupRequest;
import com.codesquad_team01.issue_tracker.auth.dto.response.LoginResponse;
import com.codesquad_team01.issue_tracker.auth.service.AuthService;
import com.codesquad_team01.issue_tracker.global.dto.ApiResponse;
import jakarta.validation.Valid;
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
    public ApiResponse<LoginResponse> loginGithub (@RequestBody GithubLoginRequest githubLoginRequest){
        String code = githubLoginRequest.code();
        LoginResponse githubLoginResponse = authService.githubLogin(code);
        return ApiResponse.success("로그인 성공", githubLoginResponse);
    }

    @PostMapping("/signup")
    public ApiResponse<Void> signup (@Valid @RequestBody SignupRequest signupRequest){
        authService.signup(signupRequest);
        return ApiResponse.success("회원가입이 완료됐습니다!", null);
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login (@Valid @RequestBody LoginRequest loginRequest){
        return ApiResponse.success("로그인 성공!", authService.login(loginRequest));
    }
}
