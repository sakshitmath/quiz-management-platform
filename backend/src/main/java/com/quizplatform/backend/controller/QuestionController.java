package com.quizplatform.backend.controller;

import com.quizplatform.backend.dto.QuestionRequest;
import com.quizplatform.backend.entity.Question;
import com.quizplatform.backend.service.QuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(QuestionService questionService) {
        this.questionService = questionService;
    }

    @GetMapping("/api/quizzes/{quizId}/questions")
    public List<Question> getByQuizId(@PathVariable Long quizId) {
        return questionService.getByQuizId(quizId);
    }

    @PostMapping("/api/quizzes/{quizId}/questions")
    public ResponseEntity<?> create(@PathVariable Long quizId, @RequestBody QuestionRequest request) {
        try {
            return ResponseEntity.ok(questionService.create(quizId, request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/api/questions/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try {
            questionService.delete(id);
            return ResponseEntity.ok("Question deleted");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}