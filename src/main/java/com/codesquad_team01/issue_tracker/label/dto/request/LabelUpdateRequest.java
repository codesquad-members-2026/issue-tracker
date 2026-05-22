package com.codesquad_team01.issue_tracker.label.dto.request;

import com.codesquad_team01.issue_tracker.label.domain.Label;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


public record LabelUpdateRequest (
        @Size(min = 1, max = 50, message = "이름은 1 ~ 50자 사이여야 합니다.")
        String name,

        @Size(max = 255, message = "설명은 255자 내로 써야 합니다.")
        String description,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 색상 코드가 아닙니다.")
        String textColor,

        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 색상 코드가 아닙니다.")
        String backgroundColor

) {

    public Label toLabel(Label label) {
        Long id = label.getId();
        String name = this.name == null ? label.getName() : this.name;
        String description = this.description == null ? label.getDescription() : this.description;
        String textColor = this.textColor == null ? label.getTextColor() : this.textColor;
        String backgroundColor = this.backgroundColor == null ? label.getBackgroundColor() : this.backgroundColor;

        return new Label(id, name, description, textColor, backgroundColor, null);
    }
}
