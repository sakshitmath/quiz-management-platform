package com.quizplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class StudentStatsResponse {
    private int totalAttempted;
    private int totalPassed;
    private int totalFailed;
    private double averageScore;
    private double highestScore;
    private List<AttemptSummaryResponse> recentAttempts;
}