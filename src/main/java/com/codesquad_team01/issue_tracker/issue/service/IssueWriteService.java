package com.codesquad_team01.issue_tracker.issue.service;

import com.codesquad_team01.issue_tracker.attachment.domain.Attachment;
import com.codesquad_team01.issue_tracker.attachment.repository.AttachmentRepository;
import com.codesquad_team01.issue_tracker.issue.domain.Assignee;
import com.codesquad_team01.issue_tracker.issue.domain.Issue;
import com.codesquad_team01.issue_tracker.issue.domain.IssueLabel;
import com.codesquad_team01.issue_tracker.issue.dto.request.IssueWriteRequest;
import com.codesquad_team01.issue_tracker.issue.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IssueWriteService {

    private final IssueRepository issueRepository;
    private final AttachmentRepository attachmentRepository;

    @Transactional
    public Long writeIssue(IssueWriteRequest issueWriteRequest, List<MultipartFile> files, Long authorId) {

        Set<Assignee> assignees = issueWriteRequest.assigneeIds().stream()
                .map(memberId -> new Assignee(null, memberId))
                .collect(Collectors.toSet());

        Set<IssueLabel> issueLabels = issueWriteRequest.labelIds().stream()
                .map(labelId -> new IssueLabel(null, labelId))
                .collect(Collectors.toSet());

        Issue issue = new Issue(
                issueWriteRequest.title(),
                issueWriteRequest.contents(),
                issueWriteRequest.milestoneId(),
                authorId,
                assignees,
                issueLabels
        );

        Issue savedIssue = issueRepository.save(issue);
        Long newIssueId = savedIssue.getId();

        List<Long> attachmentIds = issueWriteRequest.attachmentIds();
        if (attachmentIds != null && !attachmentIds.isEmpty()) {
            List<Attachment> attachments = attachmentRepository.findAllById(attachmentIds);
            for (Attachment attachment : attachments) {
                attachment.assignId(newIssueId);
            }
            attachmentRepository.saveAll(attachments);
        }

        return newIssueId;
        }
        }