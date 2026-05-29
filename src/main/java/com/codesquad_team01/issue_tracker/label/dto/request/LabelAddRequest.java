package com.codesquad_team01.issue_tracker.label.dto.request;

import com.codesquad_team01.issue_tracker.label.domain.Label;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record LabelAddRequest (

        @NotBlank(message = "레이블 이름은 필수 입력값입니다.")
        @Size(max = 50, message = "레이블 이름은 50자를 넘어갈 수 없습니다.")
        String name,

        @Size(max = 255, message = "레이블 설명은 255자를 넘어갈 수 없습니다.")
        String description,

        @NotBlank(message = "텍스트 색상은 필수 입력값입니다.")
        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 색상 코드 형식이 아닙니다. (예: #000000)")
        String textColor,

        @NotBlank(message = "배경 색상은 필수 입력값입니다.")
        @Pattern(regexp = "^#[0-9A-Fa-f]{6}$", message = "올바른 색상 코드 형식이 아닙니다. (예: #004DE3)")
        String backgroundColor

){

    public Label toLabel(){
        return new Label(null, this.name(), this.description(), this.textColor(), this.backgroundColor(), null);
    }
}
