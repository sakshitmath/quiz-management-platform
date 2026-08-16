package com.quizplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttemptResultResponse {
    private Long attemptId;
    private String quizTitle;
    private Integer totalQuestions;
    private Integer correctAnswers;
    private Integer incorrectAnswers;
    private Integer unanswered;
    private Integer totalMarks;
    private Integer obtainedMarks;
    private Double percentage;
    private String status; // PASSED or FAILED
    private Integer timeTakenSeconds;
}