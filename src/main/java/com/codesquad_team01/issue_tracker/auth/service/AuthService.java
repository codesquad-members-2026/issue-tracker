package com.codesquad_team01.issue_tracker.auth.service;

import com.codesquad_team01.issue_tracker.auth.GithubOauthClient;
import com.codesquad_team01.issue_tracker.auth.JwtProvider;
import com.codesquad_team01.issue_tracker.auth.PasswordEncoder;
import com.codesquad_team01.issue_tracker.auth.domain.RefreshToken;
import com.codesquad_team01.issue_tracker.auth.dto.request.LoginRequest;
import com.codesquad_team01.issue_tracker.auth.dto.request.SignupRequest;
import com.codesquad_team01.issue_tracker.auth.dto.response.GithubProfile;
import com.codesquad_team01.issue_tracker.auth.dto.response.LoginResult;
import com.codesquad_team01.issue_tracker.auth.repository.AuthRepository;
import com.codesquad_team01.issue_tracker.global.exception.ErrorCode;
import com.codesquad_team01.issue_tracker.global.exception.IssueTrackerException;
import com.codesquad_team01.issue_tracker.member.domain.Member;
import com.codesquad_team01.issue_tracker.member.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static com.codesquad_team01.issue_tracker.global.exception.ErrorCode.CAN_NOT_LOGIN;

@Service
public class AuthService {

    private final GithubOauthClient githubOauthClient;
    private final MemberRepository memberRepository;
    private final AuthRepository authRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;

    public AuthService(GithubOauthClient githubOauthClient, MemberRepository memberRepository,
                       AuthRepository authRepository, JwtProvider jwtProvider, PasswordEncoder passwordEncoder) {
        this.githubOauthClient = githubOauthClient;
        this.memberRepository = memberRepository;
        this.authRepository = authRepository;
        this.jwtProvider = jwtProvider;
        this.passwordEncoder = passwordEncoder;
    }

    public LoginResult login(LoginRequest request){
        Member member = memberRepository.findByUserId(request.userId())
                .orElseThrow(() -> new IssueTrackerException(CAN_NOT_LOGIN));

        if(!passwordEncoder.isMatch(request.password(), member.getPassword())){
            throw new IssueTrackerException(CAN_NOT_LOGIN);
        }

        return handleLoginResult(member);
    }
    @Transactional
    public LoginResult githubLogin(String code) {
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

        return handleLoginResult(member);
    }
    private LoginResult handleLoginResult(Member member){
        String accessJwtToken = jwtProvider.createAccessToken(member.getId());
        String refreshJwtToken = jwtProvider.createRefreshToken(member.getId());
        authRepository.save(RefreshToken.from(member.getId(), refreshJwtToken));

        return new LoginResult(accessJwtToken, refreshJwtToken, member);
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

    public void signup(SignupRequest request){
        memberRepository.findByUserId(request.userId())
                .ifPresent(member -> {
                    throw new IssueTrackerException(ErrorCode.DUPLICATE_USER_ID);
                });

        String encryptedPassword = passwordEncoder.encrypt(request.password());

        Member newMember = new Member(
                null,
                request.userId(),
                request.name(),
                encryptedPassword,
                request.email(),
                null,
                null
        );

        memberRepository.save(newMember);
    }

    public String refreshAccessToken(String refreshToken){
        Long memberId;
        try {
            memberId = jwtProvider.getMemberIdFromToken(refreshToken);
        } catch (Exception e) {
            throw new IssueTrackerException(ErrorCode.INVALID_TOKEN);
        }

        authRepository.findByToken(refreshToken)
                .orElseThrow(() -> new IssueTrackerException(ErrorCode.INVALID_TOKEN));

        return jwtProvider.createAccessToken(memberId);
    }

    public void logout(Long memberId){
        authRepository.deleteByMemberId(memberId);
    }
}
