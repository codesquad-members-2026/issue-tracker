package com.codesquad_team01.issue_tracker.auth.dto.response;

import com.codesquad_team01.issue_tracker.member.dto.response.MemberLoginResponse;

public record GithubLoginResponse(
        JwtTokenResponse token,
        MemberLoginResponse userLoginResponse
) {
}
