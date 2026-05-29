package com.codesquad_team01.issue_tracker.member.dto.response;

public class AuthorResponse {

    private final Long id;
    private final String name;

    public AuthorResponse(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {return id;}
    public String getName() {return name;}

}
