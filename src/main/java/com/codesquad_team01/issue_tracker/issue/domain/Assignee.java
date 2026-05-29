// Assignee.java 수정본
package com.codesquad_team01.issue_tracker.issue.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Assignee {
    @Id
    private Long id;
    private Long memberId;

    public Assignee(Long id, Long memberId) {
        this.id = id;
        this.memberId = memberId;
    }
}