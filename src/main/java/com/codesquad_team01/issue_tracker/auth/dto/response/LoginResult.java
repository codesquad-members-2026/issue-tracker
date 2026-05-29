package com.codesquad_team01.issue_tracker.auth.dto.response;

import com.codesquad_team01.issue_tracker.member.domain.Member;

public record LoginResult(
        String accessToken,
        String refreshToken,
        Member member
) {
}
