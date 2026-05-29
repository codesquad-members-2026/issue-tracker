package com.codesquad_team01.issue_tracker.comment.domain;


import lombok.Getter;
import org.springframework.data.annotation.Id;

import java.time.LocalDateTime;

@Getter
public class Comment {

    @Id
    private Long id;
    private Long issueId;
    private Long authorId;
    private String contents;
    private LocalDateTime createdAt;
    private LocalDateTime deletedAt;

    public Comment(Long id, Long issueId, Long authorId, String contents,
                   LocalDateTime createdAt, LocalDateTime deletedAt) {
        this.id = id;
        this.issueId = issueId;
        this.authorId = authorId;
        this.contents = contents;
        this.createdAt = createdAt;
        this.deletedAt = deletedAt;
    }

    public boolean isSameIssue(Long issueId) {
        return this.issueId.equals(issueId);
    }

    public boolean isAuthor(Long authorId) {
        return this.authorId.equals(authorId);
    }

    public void changeContents(String contents) {
        this.contents = contents;
    }


}
