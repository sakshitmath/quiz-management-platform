package com.quizplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AdminAnalyticsResponse {
    private long totalStudents;
    private long totalQuizzes;
    private long publishedQuizzes;
    private long draftQuizzes;
    private long totalQuestions;
    private long totalAttempts;
    private double averageScore;
    private long passedAttempts;
    private long failedAttempts;
}