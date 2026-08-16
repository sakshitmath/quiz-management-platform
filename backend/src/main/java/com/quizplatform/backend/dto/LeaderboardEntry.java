package com.quizplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LeaderboardEntry {
    private Long userId;
    private String name;
    private double averageScore;
    private int quizzesCompleted;
}