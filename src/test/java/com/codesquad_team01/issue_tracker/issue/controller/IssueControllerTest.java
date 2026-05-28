package com.codesquad_team01.issue_tracker.issue.controller;

import com.codesquad_team01.issue_tracker.global.exception.ErrorCode;
import com.codesquad_team01.issue_tracker.global.exception.IssueTrackerException;
import com.codesquad_team01.issue_tracker.issue.dto.request.IssueWriteRequest;
import com.codesquad_team01.issue_tracker.issue.service.IssueDetailService;
import com.codesquad_team01.issue_tracker.issue.service.IssueService;
import com.codesquad_team01.issue_tracker.issue.service.IssueWriteService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(IssueController.class)
class IssueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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
        given(loginMemberArgumentResolver.supportsParameter(any())).willReturn(true);
        given(loginMemberArgumentResolver.resolveArgument(any(), any(), any(), any())).willReturn(1L);
    }

    @Test
    @DisplayName("이슈 작성 성공 시 200 OK와 생성된 이슈 ID를 반환한다.")
    void uploadIssueSuccess() throws Exception {
        // given
        IssueWriteRequest request = new IssueWriteRequest("제목", "내용", List.of(), List.of(), null, List.of());
        MockMultipartFile requestPart = new MockMultipartFile(
                "request",
                "",
                "application/json",
                objectMapper.writeValueAsBytes(request)
        );
        when(issueWriteService.writeIssue(any(), any(), anyLong())).thenReturn(1L);

        // when & then
        mockMvc.perform(multipart("/api/issues")
                        .file(requestPart)
                        .contentType(MediaType.MULTIPART_FORM_DATA))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("이슈 작성 완료"))
                .andExpect(jsonPath("$.data.issueId").value(1L));

        verify(issueWriteService).writeIssue(any(), any(), eq(1L));
    }

    @Test
    @DisplayName("이슈 삭제 성공 시 200 OK와 성공 메시지를 반환한다.")
    void deleteIssueSuccess() throws Exception {
        Long issueId = 1L;

        mockMvc.perform(delete("/api/issues/{issueId}", issueId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("이슈 삭제 성공"));

        verify(issueService).deleteIssue(issueId);
    }

    @Test
    @DisplayName("잘못된 형식의 이슈 ID로 삭제 요청 시 400 Bad Request를 반환한다.")
    void deleteIssueInvalidIdFormat() throws Exception {
        String invalidId = "abc";

        mockMvc.perform(delete("/api/issues/{issueId}", invalidId))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("존재하지 않는 이슈 ID로 삭제 요청 시 404 Not Found를 반환한다.")
    void deleteIssueNotFound() throws Exception {
        Long issueId = 999L;
        doThrow(new IssueTrackerException(ErrorCode.CAN_NOT_FOUND_THE_PAGE))
                .when(issueService).deleteIssue(issueId);

        mockMvc.perform(delete("/api/issues/{issueId}", issueId))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }
}
