package com.codesquad_team01.issue_tracker.milestone.service;

import com.codesquad_team01.issue_tracker.label.repository.LabelRepository;
import com.codesquad_team01.issue_tracker.milestone.domain.Milestone;
import com.codesquad_team01.issue_tracker.milestone.domain.MilestoneState;
import com.codesquad_team01.issue_tracker.milestone.dto.request.MilestoneSingleRequest;
import com.codesquad_team01.issue_tracker.milestone.dto.response.MilestoneListResponse;
import com.codesquad_team01.issue_tracker.milestone.dto.response.MilestoneWriteResponse;
import com.codesquad_team01.issue_tracker.milestone.repository.MilestoneRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MilestoneServiceTest {

    @Mock
    private MilestoneRepository milestoneRepository;

    @Mock
    private LabelRepository labelRepository;

    @InjectMocks
    private MilestoneService milestoneService;

    @Test
    @DisplayName("마일스톤 목록 조회 시 메타데이터와 상태에 따른 목록을 반환한다.")
    void findMilestonesSuccess() {
        // given
        when(milestoneRepository.findAllByState(MilestoneState.OPEN)).thenReturn(List.of());
        when(labelRepository.countByDeletedAtIsNull()).thenReturn(10L);
        when(milestoneRepository.countByDeletedAtIsNull()).thenReturn(5L);

        // when
        MilestoneListResponse response = milestoneService.findMilestones(MilestoneState.OPEN);

        // then
        assertThat(response.milestoneMetaData().labelCount()).isEqualTo(10L);
        assertThat(response.milestoneMetaData().milestoneCount()).isEqualTo(5L);
        assertThat(response.milestones()).isEmpty();
    }

    @Test
    @DisplayName("마일스톤 생성 시 저장 후 응답 DTO를 반환한다.")
    void createMilestoneSuccess() {
        // given
        MilestoneSingleRequest request = new MilestoneSingleRequest("M1", null, null);
        Milestone mockMilestone = new Milestone(1L, "M1", null, null, true, null);
        when(milestoneRepository.save(any())).thenReturn(mockMilestone);

        // when
        MilestoneWriteResponse response = milestoneService.createMilestone(request);

        // then
        assertThat(response.id()).isEqualTo(1L);
    }
}