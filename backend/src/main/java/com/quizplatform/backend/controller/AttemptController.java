package com.quizplatform.backend.controller;

import com.quizplatform.backend.service.AttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AttemptController {

    private final AttemptService attemptService;

    public AttemptController(AttemptService attemptService) {
        this.attemptService = attemptService;
    }

    @PostMapping("/api/quizzes/{quizId}/start")
    public ResponseEntity<?> start(@PathVariable Long quizId) {
        try {
            return ResponseEntity.ok(attemptService.startAttempt(quizId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}