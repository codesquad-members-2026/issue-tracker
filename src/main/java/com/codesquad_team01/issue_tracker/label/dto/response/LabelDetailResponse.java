package com.codesquad_team01.issue_tracker.label.dto.response;

import com.codesquad_team01.issue_tracker.label.domain.Label;

public record LabelDetailResponse(
        Long id,
        String name,
        String description,
        String textColor,
        String backgroundColor
){

    public static LabelDetailResponse labelToResponse(Label label){
        return new LabelDetailResponse(label.getId(), label.getName(), label.getDescription(),
                label.getTextColor(), label.getBackgroundColor());
    }
}