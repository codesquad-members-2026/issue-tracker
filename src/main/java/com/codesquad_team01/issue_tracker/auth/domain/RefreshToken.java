package com.codesquad_team01.issue_tracker.auth.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;

@Getter
public class RefreshToken {

    @Id
    private Long id;

    private Long memberId;
    private String token;

    public RefreshToken(Long id, Long memberId, String token) {
        this.id = id;
        this.memberId = memberId;
        this.token = token;
    }

    public static RefreshToken from(Long memberId, String token) {
        return new RefreshToken(null, memberId, token);
    }
}
