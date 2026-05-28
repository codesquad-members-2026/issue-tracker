package com.codesquad_team01.issue_tracker.attachment.service;

import com.codesquad_team01.issue_tracker.attachment.domain.Attachment;
import com.codesquad_team01.issue_tracker.attachment.dto.response.ImageUploadResponse;
import com.codesquad_team01.issue_tracker.attachment.repository.AttachmentRepository;
import io.awspring.cloud.s3.ObjectMetadata;
import io.awspring.cloud.s3.S3Resource;
import io.awspring.cloud.s3.S3Template;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class S3ImageUploadService {

    private final S3Template s3Template;
    private final AttachmentRepository attachmentRepository;

    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    @Transactional
    public ImageUploadResponse uploadImage(MultipartFile file) {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("업로드할 파일이 비어있습니다.");
        }

        String originalFilename = file.getOriginalFilename();
        String storeFilename = "images/" +
                createStoreFilename(originalFilename);

        try (InputStream inputStream = file.getInputStream()) {

            S3Resource s3Resource = s3Template.upload(bucket, storeFilename, inputStream,
                    ObjectMetadata.builder().contentType(file.getContentType()).build());

            String uploadUrl = s3Resource.getURL().toString();

            Attachment attachment = new Attachment(
                    null,
                    null,
                    originalFilename,
                    uploadUrl,
                    file.getSize(),
                    file.getContentType(),
                    LocalDateTime.now()
            );

            Attachment savedAttachment = attachmentRepository.save(attachment);

            return new ImageUploadResponse(savedAttachment.getId(), uploadUrl);

        } catch (IOException e) {
            throw new RuntimeException("S3 파일 업로드 중 오류가 발생했습니다.", e);
        }
    }

    private String createStoreFilename(String originalFilename) {
        String ext = extractExt(originalFilename);
        String uuid = UUID.randomUUID().toString();
        return uuid + "." + ext;
    }

    private String extractExt(String originalFilename) {
        int pos = originalFilename.lastIndexOf(".");
        return originalFilename.substring(pos + 1);
    }
}