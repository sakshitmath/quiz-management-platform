package com.quizplatform.backend.controller;

import com.quizplatform.backend.dto.LeaderboardEntry;
import com.quizplatform.backend.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class LeaderboardController {

    private final UserService userService;

    public LeaderboardController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/api/leaderboard")
    public List<LeaderboardEntry> getLeaderboard() {
        return userService.getLeaderboard();
    }
}