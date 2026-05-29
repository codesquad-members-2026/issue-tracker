package com.codesquad_team01.issue_tracker.milestone.domain;

import lombok.Getter;
import org.springframework.data.annotation.Id;

import java.time.LocalDate;
import java.time.LocalDateTime;


@Getter
public class Milestone {

    @Id
    private Long id;

    private String name;
    private LocalDate completionDate;
    private String description;
    private Boolean isOpened;

    private LocalDateTime deletedAt;

    public Milestone(Long id, String name, LocalDate completionDate,
                     String description, Boolean isOpened, LocalDateTime deletedAt) {
        this.id = id;
        this.name = name;
        this.completionDate = completionDate;
        this.description = description;
        this.isOpened = isOpened;
        this.deletedAt = deletedAt;
    }

}
