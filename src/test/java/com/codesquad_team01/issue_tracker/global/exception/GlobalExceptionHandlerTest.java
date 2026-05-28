package com.codesquad_team01.issue_tracker.global.exception;

import com.codesquad_team01.issue_tracker.global.dto.ApiResponse;
import com.codesquad_team01.issue_tracker.issue.controller.IssueController;
import com.codesquad_team01.issue_tracker.issue.service.IssueDetailService;
import com.codesquad_team01.issue_tracker.issue.service.IssueService;
import com.codesquad_team01.issue_tracker.issue.service.IssueWriteService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(IssueController.class)
class GlobalExceptionHandlerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private IssueService issueService;

    @MockitoBean
    private IssueWriteService issueWriteService;

    @MockitoBean
    private IssueDetailService issueDetailService;

    @MockitoBean
    private com.codesquad_team01.issue_tracker.auth.JwtInterceptor jwtInterceptor;

    @MockitoBean
    private com.codesquad_team01.issue_tracker.auth.LoginMemberArgumentResolver loginMemberArgumentResolver;

    @BeforeEach
    void setUp() throws Exception {
        given(jwtInterceptor.preHandle(any(), any(), any())).willReturn(true);
    }

    @Test
    @DisplayName("서버 내부 오류 발생 시 500 에러와 공통 응답 규격을 반환한다.")
    void handleUncaughtException() throws Exception {
        when(issueService.getIssueList(true)).thenThrow(new RuntimeException("Unexpected error"));

        mockMvc.perform(get("/api/issues").param("status", "open"))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(ErrorCode.INTERNAL_SERVER_ERROR.getMessage()))
                .andExpect(jsonPath("$.errorCode").value(ErrorCode.INTERNAL_SERVER_ERROR.name()));
    }

    @Test
    @DisplayName("비즈니스 예외 발생 시 해당 에러 코드에 맞는 상태 코드와 메시지를 반환한다.")
    void handleIssueTrackerException() throws Exception {
        when(issueService.getIssueList(true)).thenThrow(new IssueTrackerException(ErrorCode.CAN_NOT_FOUND_THE_PAGE));

        mockMvc.perform(get("/api/issues").param("status", "open"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(ErrorCode.CAN_NOT_FOUND_THE_PAGE.getMessage()))
                .andExpect(jsonPath("$.errorCode").value(ErrorCode.CAN_NOT_FOUND_THE_PAGE.name()));
    }
}
