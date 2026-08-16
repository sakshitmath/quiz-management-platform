package com.quizplatform.backend.controller;

import com.quizplatform.backend.dto.AttemptDetailResponse;
import com.quizplatform.backend.dto.AttemptSummaryResponse;
import com.quizplatform.backend.dto.SubmitAttemptRequest;
import com.quizplatform.backend.service.AttemptService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping("/api/attempts/{attemptId}/submit")
    public ResponseEntity<?> submit(@PathVariable Long attemptId, @RequestBody SubmitAttemptRequest request) {
        try {
            return ResponseEntity.ok(attemptService.submitAttempt(attemptId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/api/attempts")
    public List<AttemptSummaryResponse> getMyAttempts() {
        return attemptService.getMyAttempts();
    }

    @GetMapping("/api/attempts/{id}")
    public ResponseEntity<?> getAttemptDetail(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(attemptService.getAttemptDetail(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}