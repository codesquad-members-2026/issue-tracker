package com.codesquad_team01.issue_tracker.issue.controller;

import com.codesquad_team01.issue_tracker.global.exception.ErrorCode;
import com.codesquad_team01.issue_tracker.global.exception.IssueTrackerException;
import com.codesquad_team01.issue_tracker.issue.service.IssueDetailService;
import com.codesquad_team01.issue_tracker.issue.service.IssueService;
import com.codesquad_team01.issue_tracker.issue.service.IssueWriteService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(IssueController.class)
class IssueControllerTest {

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

    @org.junit.jupiter.api.BeforeEach
    void setUp() throws Exception {
        org.mockito.BDDMockito.given(jwtInterceptor.preHandle(org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any(), org.mockito.ArgumentMatchers.any()))
                .willReturn(true);
    }

    @Test
    @DisplayName("이슈 삭제 성공 시 200 OK와 성공 메시지를 반환한다.")
    void deleteIssueSuccess() throws Exception {
        Long issueId = 1L;

        mockMvc.perform(delete("/api/issues/{issueId}", issueId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("이슈 삭제 성공"))
                .andExpect(jsonPath("$.data").doesNotExist())
                .andExpect(jsonPath("$.errorCode").doesNotExist());

        verify(issueService).deleteIssue(issueId);
    }

    @Test
    @DisplayName("잘못된 형식의 이슈 ID로 삭제 요청 시 400 Bad Request를 반환한다.")
    void deleteIssueInvalidIdFormat() throws Exception {
        String invalidId = "abc";

        mockMvc.perform(delete("/api/issues/{issueId}", invalidId))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(ErrorCode.INVALID_QUERY_MESSAGE.getMessage()))
                .andExpect(jsonPath("$.errorCode").value(ErrorCode.INVALID_QUERY_MESSAGE.name()));
    }

    @Test
    @DisplayName("존재하지 않는 이슈 ID로 삭제 요청 시 404 Not Found를 반환한다.")
    void deleteIssueNotFound() throws Exception {
        Long issueId = 999L;
        doThrow(new IssueTrackerException(ErrorCode.CAN_NOT_FOUND_THE_PAGE))
                .when(issueService).deleteIssue(issueId);

        mockMvc.perform(delete("/api/issues/{issueId}", issueId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.message").value(ErrorCode.CAN_NOT_FOUND_THE_PAGE.getMessage()))
                .andExpect(jsonPath("$.errorCode").value(ErrorCode.CAN_NOT_FOUND_THE_PAGE.name()));
    }
}