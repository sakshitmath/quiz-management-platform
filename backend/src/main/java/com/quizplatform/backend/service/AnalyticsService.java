package com.quizplatform.backend.service;

import com.quizplatform.backend.dto.AdminAnalyticsResponse;
import com.quizplatform.backend.entity.Attempt;
import com.quizplatform.backend.entity.Quiz;
import com.quizplatform.backend.entity.User;
import com.quizplatform.backend.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AttemptRepository attemptRepository;

    public AnalyticsService(UserRepository userRepository, QuizRepository quizRepository,
                            QuestionRepository questionRepository, AttemptRepository attemptRepository) {
        this.userRepository = userRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.attemptRepository = attemptRepository;
    }

    public AdminAnalyticsResponse getAnalytics() {
        long totalStudents = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.STUDENT)
                .count();

        List<Quiz> allQuizzes = quizRepository.findAll();
        long totalQuizzes = allQuizzes.size();
        long publishedQuizzes = allQuizzes.stream().filter(q -> q.getStatus() == Quiz.Status.PUBLISHED).count();
        long draftQuizzes = allQuizzes.stream().filter(q -> q.getStatus() == Quiz.Status.DRAFT).count();

        long totalQuestions = questionRepository.findAll().size();

        List<Attempt> completedAttempts = attemptRepository.findAll().stream()
                .filter(a -> a.getStatus() == Attempt.Status.COMPLETED)
                .toList();

        long totalAttempts = completedAttempts.size();
        double averageScore = completedAttempts.isEmpty() ? 0.0 :
                completedAttempts.stream().mapToDouble(Attempt::getPercentage).average().orElse(0.0);

        long passedAttempts = completedAttempts.stream()
                .filter(a -> {
                    Quiz quiz = a.getQuiz();
                    return a.getPercentage() >= quiz.getPassingScore();
                })
                .count();
        long failedAttempts = totalAttempts - passedAttempts;

        return new AdminAnalyticsResponse(
                totalStudents,
                totalQuizzes,
                publishedQuizzes,
                draftQuizzes,
                totalQuestions,
                totalAttempts,
                Math.round(averageScore * 100.0) / 100.0,
                passedAttempts,
                failedAttempts
        );
    }
}