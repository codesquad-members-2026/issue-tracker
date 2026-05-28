package com.codesquad_team01.issue_tracker.attachment.service;

import com.codesquad_team01.issue_tracker.attachment.service.S3ImageUploadService;
import com.codesquad_team01.issue_tracker.attachment.domain.Attachment;
import com.codesquad_team01.issue_tracker.attachment.dto.response.ImageUploadResponse;
import com.codesquad_team01.issue_tracker.attachment.repository.AttachmentRepository;
import io.awspring.cloud.s3.ObjectMetadata;
import io.awspring.cloud.s3.S3Resource;
import io.awspring.cloud.s3.S3Template;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;

import java.io.InputStream;
import java.net.URL;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class S3ImageUploadServiceTest {

    @Mock
    private S3Template s3Template;

    @Mock
    private AttachmentRepository attachmentRepository;

    @Mock
    private S3Resource s3Resource;

    @InjectMocks
    private S3ImageUploadService s3ImageUploadService;

    @Test
    @DisplayName("이미지 업로드 성공 시 S3에 업로드하고 DB에 정보를 저장한 뒤 URL을 반환한다.")
    void uploadImageSuccess() throws Exception {
        // given
        MockMultipartFile file = new MockMultipartFile(
                "file", "test.png", "image/png", "test content".getBytes());
        
        URL mockUrl = new URL("http://example.com/images/test.png");
        when(s3Resource.getURL()).thenReturn(mockUrl);
        when(s3Template.upload(any(), any(), any(InputStream.class), any(ObjectMetadata.class)))
                .thenReturn(s3Resource);

        Attachment mockAttachment = new Attachment(null, null, "test.png", mockUrl.toString(), file.getSize(), "image/png", null);
        ReflectionTestUtils.setField(mockAttachment, "id", 1L);
        when(attachmentRepository.save(any(Attachment.class))).thenReturn(mockAttachment);

        // when
        ImageUploadResponse response = s3ImageUploadService.uploadImage(file);

        // then
        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.imageUrl()).isEqualTo(mockUrl.toString());
    }
}
