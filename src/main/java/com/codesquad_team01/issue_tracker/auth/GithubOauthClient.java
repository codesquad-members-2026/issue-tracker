package com.codesquad_team01.issue_tracker.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClient;

public class GithubOauthClient {

    private final String clientId;
    private final String clientSecret;
    private final String redirectUri;
    private final RestClient restClient;

    public GithubOauthClient(
            @Value("${oauth.github.client-id}") String clientId,
            @Value("${oauth.github.client-secret}") String clientSecret,
            @Value("${oauth.github.redirect-uri}") String redirectUri
    ) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
        this.restClient = RestClient.create();
    }

//    public String getAccessToken(String code){
//
//        return "";
//    }
//
//    public GithubProfile getUserProfile(String accessToken){
//
//        return null;
//    }
}
