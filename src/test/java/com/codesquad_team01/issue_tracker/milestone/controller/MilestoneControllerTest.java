package com.codesquad_team01.issue_tracker.milestone.controller;

import com.codesquad_team01.issue_tracker.milestone.service.MilestoneService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(MilestoneController.class)
public class MilestoneControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private MilestoneService milestoneService;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("GET /api/milestones?state=open 요청이 오면 정상적으로 열린 마일스톤들과 각 마일스톤의 열린 이슈/닫힌 이슈 정보가 DTO에 담긴다")
    public void getMilestones(){

    }
}
