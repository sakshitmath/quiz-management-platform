package com.quizplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AttemptSummaryResponse {
    private Long attemptId;
    private String quizTitle;
    private Double percentage;
    private String status;
    private LocalDateTime completedAt;
}