package com.codesquad_team01.issue_tracker.milestone.dto.request;

import com.codesquad_team01.issue_tracker.milestone.domain.MilestoneState;
import jakarta.validation.constraints.NotNull;

public record MilestoneStateRequest(
        @NotNull(message = "열림/닫힘 상태는 필수입니다.")
        MilestoneState state
) {
}
