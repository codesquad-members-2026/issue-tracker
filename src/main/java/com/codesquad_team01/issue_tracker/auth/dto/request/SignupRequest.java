package com.codesquad_team01.issue_tracker.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(

        @NotBlank(message = "아이디는 필수 입력 값입니다.")
        @Size(min = 6, max = 16, message = "아이디는 6자 이상 16자 이하로 입력해주세요.")
        String userId,

        @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
        @Size(min = 6, max = 12, message = "비밀번호는 6자 이상 12자 이하로 입력해주세요.")
        String password,

        String name,

        @Email(message = "올바른 이메일 형식이 아닙니다.")
        String email
) {
}
