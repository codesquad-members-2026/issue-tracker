package com.codesquad_team01.issue_tracker.milestone.dto.request;

import com.codesquad_team01.issue_tracker.milestone.domain.Milestone;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record MilestoneSingleRequest (
        @NotBlank(message = "마일스톤 이름은 필수 입력값입니다.")
        @Size(max = 50, message = "마일스톤 이름은 50자를 넘어갈 수 없습니다.")
        String name,

        @FutureOrPresent(message = "마일스톤 완료일은 오늘 또는 미래의 날짜여야 합니다.")
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy. MM. dd")
        LocalDate completionDate,

        @Size(max = 255, message = "마일스톤 설명은 255자를 넘어갈 수 없습니다.")
        String description
) {

    public Milestone toMilestone() {
        return new Milestone(null, name, completionDate, description, true, null);
    }
}