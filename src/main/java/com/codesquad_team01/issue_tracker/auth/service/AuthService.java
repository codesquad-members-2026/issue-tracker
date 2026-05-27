package com.codesquad_team01.issue_tracker.auth.service;

import com.codesquad_team01.issue_tracker.auth.GithubOauthClient;
import com.codesquad_team01.issue_tracker.auth.JwtProvider;
import com.codesquad_team01.issue_tracker.auth.dto.response.GithubLoginResponse;
import com.codesquad_team01.issue_tracker.auth.dto.response.GithubProfile;
import com.codesquad_team01.issue_tracker.auth.dto.response.JwtTokenResponse;
import com.codesquad_team01.issue_tracker.member.domain.Member;
import com.codesquad_team01.issue_tracker.member.dto.response.MemberLoginResponse;
import com.codesquad_team01.issue_tracker.member.repository.MemberRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final GithubOauthClient githubOauthClient;
    private final MemberRepository memberRepository;
    private final JwtProvider jwtProvider;

    public AuthService(GithubOauthClient githubOauthClient, MemberRepository memberRepository,  JwtProvider jwtProvider){
        this.githubOauthClient = githubOauthClient;
        this.memberRepository = memberRepository;
        this.jwtProvider = jwtProvider;
    }

    public GithubLoginResponse login(String code) {
        String accessToken = githubOauthClient.getAccessToken(code);
        GithubProfile profile = githubOauthClient.getUserProfile(accessToken);

        Member member = memberRepository.findByOauthId(profile.oauthId())
                .map(m -> {
                    if(m.getDeletedAt() != null){
                        m.restore();
                        return memberRepository.save(m);
                    }
                    return m;
                })
                .orElseGet(() -> registerNewMember(profile));

        String jwtToken = jwtProvider.createAccessToken(member.getId());

        return new GithubLoginResponse(new JwtTokenResponse(jwtToken), MemberLoginResponse.from(member));
    }

    private Member registerNewMember(GithubProfile profile){
        Member newMember = new Member(
                null,
                profile.login(),
                profile.name(),
                null,
                null,
                profile.oauthId(),
                null);
        return memberRepository.save(newMember);
    }

}
