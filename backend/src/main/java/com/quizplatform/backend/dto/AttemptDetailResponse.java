package com.quizplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class AttemptDetailResponse {
    private Long attemptId;
    private String quizTitle;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer incorrectAnswers;
    private Integer unanswered;
    private Double percentage;
    private String status;
    private Integer timeTakenSeconds;
    private List<AnswerReviewResponse> answers;
}