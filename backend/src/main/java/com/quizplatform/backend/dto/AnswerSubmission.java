package com.quizplatform.backend.dto;

import lombok.Data;

@Data
public class AnswerSubmission {
    private Long questionId;
    private Long selectedOptionId; // null if unanswered
}