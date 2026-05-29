package com.codesquad_team01.issue_tracker.label.dto.response;

import com.codesquad_team01.issue_tracker.label.domain.Label;

public record LabelListResponse(
        Long id,
        String name,
        String description,
        String textColor,
        String backgroundColor
) {

    public static LabelListResponse from(Label label){
        return new LabelListResponse(label.getId(), label.getName(), label.getDescription(),
                label.getTextColor(), label.getBackgroundColor());
    }
}

