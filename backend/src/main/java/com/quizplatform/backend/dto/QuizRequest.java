package com.quizplatform.backend.dto;

import lombok.Data;

@Data
public class QuizRequest {
    private String title;
    private String description;
    private Long categoryId;
    private String difficulty; // EASY, INTERMEDIATE, HARD
    private Integer duration;
    private Integer passingScore;
    private Integer maxAttempts;
}