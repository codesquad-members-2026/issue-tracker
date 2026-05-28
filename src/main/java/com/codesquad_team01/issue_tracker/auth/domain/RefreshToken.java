package com.codesquad_team01.issue_tracker.auth.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Getter
public class RefreshToken {

    @Id
    private Long id;

    private Long memberId;
    private String token;
    private LocalDateTime deletedAt;

    public RefreshToken(Long id, Long memberId, String token, LocalDateTime deletedAt) {
        this.id = id;
        this.memberId = memberId;
        this.token = token;
        this.deletedAt = deletedAt;
    }

    public static RefreshToken from(Long memberId, String token) {
        return new RefreshToken(null, memberId, token, null);
    }
}
