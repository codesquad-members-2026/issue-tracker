package com.codesquad_team01.issue_tracker.issue.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import java.time.LocalDateTime;

@Getter
public class Issue {

    @Id
    private Long id;

    private String title;
    private String contents;
    private boolean isOpened;
    private Long authorId;
    private Long milestoneId;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;


    public Issue(String title, String contents, boolean isOpened, Long authorId,
                 Long milestoneId,  LocalDateTime createdAt, LocalDateTime deletedAt) {
        this.title = title;
        this.contents = contents;
        this.isOpened = isOpened;
        this.authorId = authorId;
        this.milestoneId = milestoneId;
        this.createdAt = createdAt;
        this.deletedAt = deletedAt;
    }
}
