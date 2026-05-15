package com.codesquad_team01.issue_tracker.issue.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import java.time.LocalDateTime;

@Getter
public class Member {

    @Id
    private Long id;

    private String userId;
    private String name;
    private String password;
    private String email;
    private LocalDateTime deletedAt;

    public Member(Long id, String userId, String name, String password, String email, LocalDateTime deletedAt) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.password = password;
        this.email = email;
        this.deletedAt = deletedAt;
    }

}
