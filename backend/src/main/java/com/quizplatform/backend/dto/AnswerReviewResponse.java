package com.quizplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnswerReviewResponse {
    private Long questionId;
    private String questionText;
    private String selectedOptionText; // null if unanswered
    private String correctOptionText;
    private String explanation;
    private boolean correct;
}