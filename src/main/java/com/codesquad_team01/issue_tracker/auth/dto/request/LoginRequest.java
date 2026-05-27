package com.codesquad_team01.issue_tracker.auth.dto.request;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "아이디를 입력해주세요.")
        String userId,

        @NotBlank(message = "비밀번호를 입력해주세요.")
        String password
) {
}
