package com.codesquad_team01.issue_tracker.member.dto.response;

import com.codesquad_team01.issue_tracker.member.domain.Member;

public record MemberLoginResponse(
        Long id,
        String userId
) {

    public static MemberLoginResponse from(Member member) {
        return new MemberLoginResponse(member.getId(), member.getUserId());
    }
}
