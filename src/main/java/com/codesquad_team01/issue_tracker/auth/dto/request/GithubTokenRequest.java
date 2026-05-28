package com.codesquad_team01.issue_tracker.auth.dto.request;

public record GithubTokenRequest (
        String client_id,
        String client_secret,
        String code,
        String redirect_url
){
}
