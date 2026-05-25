package com.codesquad_team01.issue_tracker.attachment.Controller;


import com.codesquad_team01.issue_tracker.attachment.Service.S3ImageUploadService;
import com.codesquad_team01.issue_tracker.attachment.dto.response.ImageUploadResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class S3ImageUploadController {

    private final S3ImageUploadService s3ImageUploadService;

    @PostMapping("/api/images/upload")
    public ImageUploadResponse upload(@RequestParam("file") MultipartFile file) {
        String uploadUrl = s3ImageUploadService.uploadImage(file);


        return new ImageUploadResponse(uploadUrl);

    }


}
