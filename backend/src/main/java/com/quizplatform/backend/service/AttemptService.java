package com.quizplatform.backend.service;

import com.quizplatform.backend.dto.*;
import com.quizplatform.backend.entity.*;
import com.quizplatform.backend.repository.*;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AttemptService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final OptionRepository optionRepository;
    private final AttemptRepository attemptRepository;
    private final CurrentUserService currentUserService;

    public AttemptService(QuizRepository quizRepository, QuestionRepository questionRepository,
                          OptionRepository optionRepository, AttemptRepository attemptRepository,
                          CurrentUserService currentUserService) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.attemptRepository = attemptRepository;
        this.currentUserService = currentUserService;
    }

    public AttemptStartResponse startAttempt(Long quizId) {
        User user = currentUserService.getCurrentUser();

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (quiz.getStatus() != Quiz.Status.PUBLISHED) {
            throw new RuntimeException("Quiz is not available");
        }

        List<Attempt> previousAttempts = attemptRepository.findByQuizIdAndUserId(quizId, user.getId());
        long completedCount = previousAttempts.stream()
                .filter(a -> a.getStatus() == Attempt.Status.COMPLETED)
                .count();

        if (completedCount >= quiz.getMaxAttempts()) {
            throw new RuntimeException("Maximum attempts reached for this quiz");
        }

        List<Question> questions = questionRepository.findByQuizId(quizId);
        if (questions.isEmpty()) {
            throw new RuntimeException("This quiz has no questions yet");
        }

        Attempt attempt = new Attempt();
        attempt.setQuiz(quiz);
        attempt.setUser(user);
        attempt.setStatus(Attempt.Status.IN_PROGRESS);
        attempt.setStartedAt(LocalDateTime.now());
        Attempt savedAttempt = attemptRepository.save(attempt);

        List<QuestionResponse> questionResponses = questions.stream().map(q -> {
            List<Option> options = optionRepository.findByQuestionId(q.getId());
            List<OptionResponse> optionResponses = options.stream()
                    .map(o -> new OptionResponse(o.getId(), o.getOptionText()))
                    .collect(Collectors.toList());
            return new QuestionResponse(q.getId(), q.getQuestionText(), q.getMarks(), optionResponses);
        }).collect(Collectors.toList());

        LocalDateTime expiresAt = savedAttempt.getStartedAt().plusMinutes(quiz.getDuration());

        return new AttemptStartResponse(
                savedAttempt.getId(),
                quiz.getId(),
                quiz.getTitle(),
                quiz.getDuration(),
                savedAttempt.getStartedAt(),
                expiresAt,
                questionResponses
        );
    }
}