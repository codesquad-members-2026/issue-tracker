// IssueLabel.java 수정본
package com.codesquad_team01.issue_tracker.issue.domain;

import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class IssueLabel {
    @Id
    private Long id;
    private Long labelId;

    public IssueLabel(Long id, Long labelId) {
        this.id = id;
        this.labelId = labelId;
    }
}