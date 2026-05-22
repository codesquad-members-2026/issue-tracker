package com.codesquad_team01.issue_tracker.issue.dto.request;

import jakarta.validation.constraints.NotBlank;

public record IssueTitleUpdateRequest(
        @NotBlank(message = "이슈 제목은 공백일 수 없습니다.")
        String title)
{ }