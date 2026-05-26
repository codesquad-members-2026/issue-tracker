package com.codesquad_team01.issue_tracker.attachment.repository;

import com.codesquad_team01.issue_tracker.attachment.domain.Attachment;
import org.springframework.data.repository.ListCrudRepository;

public interface AttachmentRepository extends ListCrudRepository<Attachment, Long> {
}
