package com.codesquad_team01.issue_tracker.auth.service;

import com.codesquad_team01.issue_tracker.auth.GithubOauthClient;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final GithubOauthClient githubOauthClient;

    public AuthService(GithubOauthClient githubOauthClient){
        this.githubOauthClient = githubOauthClient;
    }

    public String login(String code) {
        String accessToken = githubOauthClient.getAccessToken(code);

        return accessToken;
    }
}
