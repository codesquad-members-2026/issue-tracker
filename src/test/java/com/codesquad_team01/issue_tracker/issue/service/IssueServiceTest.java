package com.codesquad_team01.issue_tracker.issue.service;

import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.dto.mapper.IssueDtoMapper;
import com.codesquad_team01.issue_tracker.issue.dto.request.IssueFilterRequest;
import com.codesquad_team01.issue_tracker.issue.dto.response.IssueListResponse;
import com.codesquad_team01.issue_tracker.issue.dto.response.IssueResponse;
import com.codesquad_team01.issue_tracker.issue.repository.IssueRepository;
import com.codesquad_team01.issue_tracker.label.repository.LabelRepository;
import com.codesquad_team01.issue_tracker.milestone.repository.MilestoneRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IssueServiceTest {

    @Mock
    private IssueRepository issueRepository;

    @Mock
    private LabelRepository labelRepository;

    @Mock
    private MilestoneRepository milestoneRepository;

    @Mock
    private IssueDtoMapper issueDtoMapper;

    @InjectMocks
    private IssueService issueService;

    @BeforeEach
    void setUp() {
        // 공통으로 사용되는 카운트 목킹
        lenient().when(issueRepository.countByStatus(true)).thenReturn(5L);
        lenient().when(issueRepository.countByStatus(false)).thenReturn(2L);
        lenient().when(labelRepository.countByDeletedAtIsNull()).thenReturn(10L);
        lenient().when(milestoneRepository.countByDeletedAtIsNull()).thenReturn(3L);
    }

    @Test
    @DisplayName("이슈 목록 조회 시 메타데이터와 함께 이슈 리스트를 반환한다.")
    void getIssueListSuccess() {
        // given
        boolean isOpened = true;
        List<Issue> mockIssues = List.of();
        when(issueRepository.findList(isOpened)).thenReturn(mockIssues);

        // when
        IssueListResponse response = issueService.getIssueList(isOpened);

        // then
        assertThat(response.metadata().openIssueCount()).isEqualTo(5L);
        assertThat(response.metadata().closedIssueCount()).isEqualTo(2L);
        assertThat(response.metadata().labelCount()).isEqualTo(10L);
        assertThat(response.metadata().milestoneCount()).isEqualTo(3L);
        assertThat(response.issues()).isEmpty();
    }

    @Test
    @DisplayName("필터 조건에 맞는 이슈 ID 목록을 조회한 후, 해당 이슈들의 상세 정보를 정렬하여 반환한다.")
    void getFilteredIssueListSuccess() {
        // given
        IssueFilterRequest request = new IssueFilterRequest(true, 1L, List.of(), null, null, List.of());
        List<Long> mockIds = List.of(2L, 1L);
        when(issueRepository.findByFilterCondition(request)).thenReturn(mockIds);

        Issue issue1 = mock(Issue.class);
        when(issue1.getId()).thenReturn(1L);
        Issue issue2 = mock(Issue.class);
        when(issue2.getId()).thenReturn(2L);
        
        when(issueRepository.findAllById(mockIds)).thenReturn(List.of(issue1, issue2));
        when(issueDtoMapper.toIssueResponses(any())).thenReturn(List.of(mock(IssueResponse.class), mock(IssueResponse.class)));

        // when
        IssueListResponse response = issueService.getFilteredIssueList(request);

        // then
        assertThat(response.issues()).hasSize(2);
        verify(issueRepository).findByFilterCondition(request);
        verify(issueRepository).findAllById(mockIds);
    }
}