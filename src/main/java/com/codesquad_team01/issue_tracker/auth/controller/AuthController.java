package com.codesquad_team01.issue_tracker.auth.controller;

import com.codesquad_team01.issue_tracker.auth.dto.request.GithubLoginRequest;
import com.codesquad_team01.issue_tracker.auth.dto.request.LoginRequest;
import com.codesquad_team01.issue_tracker.auth.dto.request.SignupRequest;
import com.codesquad_team01.issue_tracker.auth.dto.response.JwtTokenResponse;
import com.codesquad_team01.issue_tracker.auth.dto.response.LoginResponse;
import com.codesquad_team01.issue_tracker.auth.dto.response.LoginResult;
import com.codesquad_team01.issue_tracker.auth.service.AuthService;
import com.codesquad_team01.issue_tracker.global.dto.ApiResponse;
import com.codesquad_team01.issue_tracker.global.exception.ErrorCode;
import com.codesquad_team01.issue_tracker.global.exception.IssueTrackerException;
import com.codesquad_team01.issue_tracker.member.dto.response.MemberLoginResponse;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService){
        this.authService = authService;
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login (
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletResponse response
    ){

        LoginResult loginResult = authService.login(loginRequest);
        return handleLoginSuccess(loginResult, response);
    }

    @PostMapping("/login/github")
    public ApiResponse<LoginResponse> loginGithub (
            @RequestBody GithubLoginRequest githubLoginRequest,
            HttpServletResponse response
    ){

        String code = githubLoginRequest.code();
        LoginResult loginResult = authService.githubLogin(code);
        return handleLoginSuccess(loginResult, response);
    }

    private ApiResponse<LoginResponse> handleLoginSuccess(LoginResult loginResult, HttpServletResponse response){
        ResponseCookie cookie = ResponseCookie.from("refreshToken", loginResult.refreshToken())
                .maxAge(7 * 24 * 60 * 60)
                .path("/")
                .secure(false)
                .httpOnly(true)
                .sameSite("Lax")
                .build();
        response.addHeader("Set-Cookie", cookie.toString());

        JwtTokenResponse jwtTokenResponse = new JwtTokenResponse(loginResult.accessToken());
        MemberLoginResponse memberLoginResponse = MemberLoginResponse.from(loginResult.member());
        LoginResponse loginResponse = new LoginResponse(jwtTokenResponse, memberLoginResponse);
        return ApiResponse.success("로그인 성공!", loginResponse);
    }

    @PostMapping("/signup")
    public ApiResponse<Void> signup (@Valid @RequestBody SignupRequest signupRequest){
        authService.signup(signupRequest);
        return ApiResponse.success("회원가입이 완료됐습니다!", null);
    }

    @PostMapping("/refresh")
    public ApiResponse<JwtTokenResponse> refresh(
            @CookieValue(value = "refreshToken", required = false) String refreshToken
    ){
        if(refreshToken == null){
            throw new IssueTrackerException(ErrorCode.NOT_FOUND_TOKEN);
        }

        String newAccessToken = authService.refreshAccessToken(refreshToken);
        return ApiResponse.success("토큰 재발급 성공", new JwtTokenResponse(newAccessToken));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(
            @RequestAttribute("memberId") Long memberId,
            HttpServletResponse response
    ){

        authService.logout(memberId);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", "")
                .maxAge(0)
                .path("/")
                .secure(false)
                .httpOnly(true)
                .sameSite("Lax")
                .build();

        response.addHeader("Set-Cookie", cookie.toString());

        return ApiResponse.success("로그아웃 성공", null);
    }
}
