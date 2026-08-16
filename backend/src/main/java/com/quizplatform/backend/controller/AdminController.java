package com.quizplatform.backend.controller;

import java.util.List;
import com.quizplatform.backend.dto.AdminAnalyticsResponse;
import com.quizplatform.backend.service.AnalyticsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.quizplatform.backend.dto.QuizPopularityEntry;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AnalyticsService analyticsService;

    public AdminController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/analytics")
    public AdminAnalyticsResponse getAnalytics() {
        return analyticsService.getAnalytics();
    }
    @GetMapping("/quiz-popularity")
    public List<QuizPopularityEntry> getQuizPopularity() {
        return analyticsService.getQuizPopularity();
    }
}