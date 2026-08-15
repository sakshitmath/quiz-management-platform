package com.quizplatform.backend.service;

import com.quizplatform.backend.dto.QuizRequest;
import com.quizplatform.backend.entity.Category;
import com.quizplatform.backend.entity.Quiz;
import com.quizplatform.backend.repository.CategoryRepository;
import com.quizplatform.backend.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final CategoryRepository categoryRepository;

    public QuizService(QuizRepository quizRepository, CategoryRepository categoryRepository) {
        this.quizRepository = quizRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<Quiz> getAllPublished() {
        return quizRepository.findByStatus(Quiz.Status.PUBLISHED);
    }

    public List<Quiz> getAllForAdmin() {
        return quizRepository.findAll();
    }

    public Quiz getById(Long id) {
        return quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    public Quiz create(QuizRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        Quiz quiz = new Quiz();
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setCategory(category);
        quiz.setDifficulty(Quiz.Difficulty.valueOf(request.getDifficulty()));
        quiz.setDuration(request.getDuration());
        quiz.setPassingScore(request.getPassingScore());
        quiz.setMaxAttempts(request.getMaxAttempts());
        quiz.setStatus(Quiz.Status.DRAFT);

        return quizRepository.save(quiz);
    }

    public Quiz update(Long id, QuizRequest request) {
        Quiz quiz = getById(id);
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        quiz.setCategory(category);
        quiz.setDifficulty(Quiz.Difficulty.valueOf(request.getDifficulty()));
        quiz.setDuration(request.getDuration());
        quiz.setPassingScore(request.getPassingScore());
        quiz.setMaxAttempts(request.getMaxAttempts());
        quiz.setUpdatedAt(LocalDateTime.now());

        return quizRepository.save(quiz);
    }

    public void delete(Long id) {
        if (!quizRepository.existsById(id)) {
            throw new RuntimeException("Quiz not found");
        }
        quizRepository.deleteById(id);
    }

    public Quiz togglePublish(Long id) {
        Quiz quiz = getById(id);
        if (quiz.getStatus() == Quiz.Status.PUBLISHED) {
            quiz.setStatus(Quiz.Status.UNPUBLISHED);
        } else {
            quiz.setStatus(Quiz.Status.PUBLISHED);
        }
        quiz.setUpdatedAt(LocalDateTime.now());
        return quizRepository.save(quiz);
    }
}