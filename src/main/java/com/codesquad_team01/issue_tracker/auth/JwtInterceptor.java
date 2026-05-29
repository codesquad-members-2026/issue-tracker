package com.codesquad_team01.issue_tracker.auth;

import com.codesquad_team01.issue_tracker.global.exception.ErrorCode;
import com.codesquad_team01.issue_tracker.global.exception.IssueTrackerException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtProvider jwtProvider;

    public JwtInterceptor(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String authHeader = request.getHeader("Authorization");

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new IssueTrackerException(ErrorCode.NOT_FOUND_TOKEN);
        }

        String token = authHeader.replace("Bearer ", "");

        try {
            Long memberId = jwtProvider.getMemberIdFromToken(token);
            request.setAttribute("memberId", memberId);
        } catch (Exception e){
            throw new IssueTrackerException(ErrorCode.INVALID_TOKEN);
        }

        return true;
    }
}