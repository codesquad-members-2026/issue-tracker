package com.codesquad_team01.issue_tracker.member.dto.mapper;

import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.member.dto.response.AuthorResponse;
import com.codesquad_team01.issue_tracker.member.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@RequiredArgsConstructor
public class AuthorDtoMapper {

    private final MemberRepository memberRepository;

    public Map<Long, AuthorResponse> getAuthorMap(List<Issue> issues) {
        List<Long> authorIds = new ArrayList<>();
        for (Issue issue : issues) {
            authorIds.add(issue.getAuthorId());
        }

        Map<Long, AuthorResponse> authorMap = new HashMap<>();
        memberRepository.findAllById(authorIds).forEach(m ->
                authorMap.put(m.getId(), new AuthorResponse(m.getId(), m.getName()))
        );
        return authorMap;
    }

    public Map<Long, AuthorResponse> getAuthorMapByMemberIds(Collection<Long> memberIds) {
        Map<Long, AuthorResponse> authorMap = new HashMap<>();
        memberRepository.findAllById(memberIds).forEach(m ->
                authorMap.put(m.getId(), new AuthorResponse(m.getId(), m.getName()))
        );
        return authorMap;
    }

    public List<AuthorResponse> getAssignees(Issue issue, Map<Long, AuthorResponse> memberMap) {
        return issue.getAssignees().stream()
                .map(assignee -> memberMap.get(assignee.getMemberId()))
                .filter(Objects::nonNull)
                .toList();
    }
}