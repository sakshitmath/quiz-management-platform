package com.quizplatform.backend.controller;

import com.quizplatform.backend.dto.QuizRequest;
import com.quizplatform.backend.entity.Quiz;
import com.quizplatform.backend.service.QuizService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    private final QuizService quizService;

    public QuizController(QuizService quizService) {
        this.quizService = quizService;
    }

    // Public: students see only published quizzes
    @GetMapping
    public List<Quiz> getPublished() {
        return quizService.getAllPublished();
    }

    // Admin: see all quizzes including drafts
    @GetMapping("/admin/all")
    public List<Quiz> getAllForAdmin() {
        return quizService.getAllForAdmin();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(quizService.getById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody QuizRequest request) {
        try {
            return ResponseEntity.ok(quizService.create(request));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody QuizRequest request) {
        try {
            return ResponseEntity.ok(quizService.update(id, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            quizService.delete(id);
            return ResponseEntity.ok("Quiz deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/publish")
    public ResponseEntity<?> togglePublish(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(quizService.togglePublish(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}