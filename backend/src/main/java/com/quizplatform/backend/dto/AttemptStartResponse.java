package com.quizplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class AttemptStartResponse {
    private Long attemptId;
    private Long quizId;
    private String quizTitle;
    private Integer duration; // minutes
    private LocalDateTime startedAt;
    private LocalDateTime expiresAt;
    private List<QuestionResponse> questions;
}