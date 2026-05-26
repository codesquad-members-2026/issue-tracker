package com.codesquad_team01.issue_tracker.attachment.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;

import java.time.LocalDateTime;

@Getter
public class Attachment {

    @Id
    private Long id;
    private Long issueId;
    private Long commentId;

    @Column("file_name")
    private String filename;

    @Column("file_url")
    private String fileUrl;

    @Column("file_size")
    private Long size;

    @Column("Content_type")
    private String contentType;

    @Column("created_at")
    private LocalDateTime createdAt;

    public Attachment(Long issueId, Long commentId, String filename, String fileUrl, Long size,
                      String contentType, LocalDateTime createdAt) {
        this.issueId = issueId;
        this.commentId = commentId;
        this.filename = filename;
        this.fileUrl = fileUrl;
        this.size = size;
        this.contentType = contentType;
        this.createdAt = createdAt;

    }
}
