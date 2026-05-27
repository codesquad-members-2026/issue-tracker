package com.codesquad_team01.issue_tracker.member.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Getter
public class Member {

    @Id
    private Long id;

    private String userId;
    private String name;
    private String password;
    private String email;
    private Long oauthId;
    private LocalDateTime deletedAt;

    public Member(Long id, String userId, String name, String password, String email, Long oauthId, LocalDateTime deletedAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.password = password;
        this.email = email;
        this.oauthId = oauthId;
        this.deletedAt = deletedAt;
    }

    public void restore(){
        this.deletedAt = null;
    }
}
