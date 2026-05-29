package com.codesquad_team01.issue_tracker.milestone.dto.response;

import com.codesquad_team01.issue_tracker.milestone.domain.Milestone;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public record MilestoneSingleResponse(
    Long id,
    String name,

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yy. MM. dd")
    LocalDate completionDate,

    String description
) {

    public static MilestoneSingleResponse from(Milestone milestone) {
        return new MilestoneSingleResponse(
                milestone.getId(),
                milestone.getName(),
                milestone.getCompletionDate(),
                milestone.getDescription()
        );
    }
}
