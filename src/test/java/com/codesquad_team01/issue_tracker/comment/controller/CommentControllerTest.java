package com.codesquad_team01.issue_tracker.comment.controller;

import com.codesquad_team01.issue_tracker.comment.domain.Comment;
import com.codesquad_team01.issue_tracker.comment.dto.mapper.CommentDtoMapper;
import com.codesquad_team01.issue_tracker.comment.dto.request.CommentRequest;
import com.codesquad_team01.issue_tracker.comment.dto.response.CommentResponse;
import com.codesquad_team01.issue_tracker.comment.service.CommentService;
import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.repository.IssueRepository;
import com.codesquad_team01.issue_tracker.member.domain.Member;
import com.codesquad_team01.issue_tracker.member.dto.response.AuthorResponse;
import com.codesquad_team01.issue_tracker.member.repository.MemberRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CommentController.class)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private CommentService commentService;

    @MockitoBean
    private CommentDtoMapper commentDtoMapper;

    @MockitoBean
    private MemberRepository memberRepository;

    @MockitoBean
    private IssueRepository issueRepository;

    @MockitoBean
    private com.codesquad_team01.issue_tracker.auth.JwtInterceptor jwtInterceptor;

    @MockitoBean
    private com.codesquad_team01.issue_tracker.auth.LoginMemberArgumentResolver loginMemberArgumentResolver;

    @BeforeEach
    void setUp() throws Exception {
        given(jwtInterceptor.preHandle(any(), any(), any())).willReturn(true);
        // Mocking LoginMemberArgumentResolver to return memberId 1L
        given(loginMemberArgumentResolver.supportsParameter(any())).willReturn(true);
        given(loginMemberArgumentResolver.resolveArgument(any(), any(), any(), any())).willReturn(1L);
    }

    @Test
    @DisplayName("댓글 작성 성공 시 200 OK를 반환한다.")
    void createCommentSuccess() throws Exception {
        Long memberId = 1L;
        Long issueId = 1L;
        CommentRequest request = new CommentRequest("Nice comment", List.of());
        Comment mockComment = new Comment(100L, issueId, memberId, "Nice comment", LocalDateTime.now(), null);
        
        when(commentService.createComment(eq(issueId), any(), eq(memberId))).thenReturn(mockComment);
        
        Member mockMember = new Member(memberId, "tester", "테스터", "pw", "test@test.com", null, null);
        when(memberRepository.findById(memberId)).thenReturn(Optional.of(mockMember));
        
        Issue mockIssue = mock(Issue.class);
        when(mockIssue.getAuthorId()).thenReturn(memberId);
        when(issueRepository.findById(issueId)).thenReturn(Optional.of(mockIssue));
        
        CommentResponse mockResponse = new CommentResponse(100L, new AuthorResponse(memberId, "테스터"), "Nice comment", LocalDateTime.now(), true);
        when(commentDtoMapper.toCommentResponse(any(), any(), any(), anyBoolean())).thenReturn(mockResponse);

        mockMvc.perform(post("/api/issues/{issueId}/comments", issueId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("댓글 작성 완료"))
                .andExpect(jsonPath("$.data.id").value(100L));
    }

    @Test
    @DisplayName("댓글 수정 성공 시 200 OK를 반환한다.")
    void updateCommentSuccess() throws Exception {
        CommentRequest request = new CommentRequest("Updated content", List.of());

        mockMvc.perform(patch("/api/issues/{issueId}/comments/{commentId}", 1L, 100L)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("댓글 수정 완료"));
    }
}
