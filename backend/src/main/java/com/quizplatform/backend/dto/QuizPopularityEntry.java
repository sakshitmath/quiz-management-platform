package com.quizplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class QuizPopularityEntry {
    private String quizTitle;
    private long attemptCount;
}