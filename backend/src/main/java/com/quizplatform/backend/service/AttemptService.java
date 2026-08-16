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
    private final AnswerRepository answerRepository;
    private final CurrentUserService currentUserService;

    public AttemptService(QuizRepository quizRepository, QuestionRepository questionRepository,
                          OptionRepository optionRepository, AttemptRepository attemptRepository,
                          AnswerRepository answerRepository, CurrentUserService currentUserService) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.optionRepository = optionRepository;
        this.attemptRepository = attemptRepository;
        this.answerRepository = answerRepository;
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
        long usedAttempts = previousAttempts.stream()
                .filter(a -> a.getStatus() == Attempt.Status.COMPLETED || a.getStatus() == Attempt.Status.EXPIRED)
                .count();

        if (usedAttempts >= quiz.getMaxAttempts()) {
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

    public AttemptResultResponse submitAttempt(Long attemptId, SubmitAttemptRequest request) {
        User user = currentUserService.getCurrentUser();

        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("This attempt does not belong to you");
        }

        if (attempt.getStatus() != Attempt.Status.IN_PROGRESS) {
            throw new RuntimeException("This attempt has already been submitted");
        }

        Quiz quiz = attempt.getQuiz();
        List<Question> allQuestions = questionRepository.findByQuizId(quiz.getId());

        LocalDateTime expiresAt = attempt.getStartedAt().plusMinutes(quiz.getDuration());
        boolean expired = LocalDateTime.now().isAfter(expiresAt);

        int correctCount = 0;
        int incorrectCount = 0;
        int unansweredCount = 0;
        int obtainedMarks = 0;
        int totalMarks = 0;

        for (Question question : allQuestions) {
            totalMarks += question.getMarks();

            AnswerSubmission submitted = request.getAnswers() == null ? null :
                    request.getAnswers().stream()
                            .filter(a -> a.getQuestionId().equals(question.getId()))
                            .findFirst()
                            .orElse(null);

            Answer answer = new Answer();
            answer.setAttempt(attempt);
            answer.setQuestion(question);

            if (submitted == null || submitted.getSelectedOptionId() == null) {
                unansweredCount++;
                answer.setCorrect(false);
                answer.setSelectedOption(null);
            } else {
                Option selectedOption = optionRepository.findById(submitted.getSelectedOptionId())
                        .orElseThrow(() -> new RuntimeException("Invalid option selected"));

                boolean isCorrect = selectedOption.isCorrect() && selectedOption.getQuestion().getId().equals(question.getId());

                answer.setSelectedOption(selectedOption);
                answer.setCorrect(isCorrect);

                if (isCorrect) {
                    correctCount++;
                    obtainedMarks += question.getMarks();
                } else {
                    incorrectCount++;
                }
            }

            answerRepository.save(answer);
        }

        double percentage = totalMarks == 0 ? 0 : (obtainedMarks * 100.0) / totalMarks;
        boolean passed = percentage >= quiz.getPassingScore();

        int timeTakenSeconds = (int) java.time.Duration.between(attempt.getStartedAt(), LocalDateTime.now()).getSeconds();

        attempt.setScore(obtainedMarks);
        attempt.setPercentage(percentage);
        attempt.setCorrectAnswers(correctCount);
        attempt.setIncorrectAnswers(incorrectCount);
        attempt.setUnanswered(unansweredCount);
        attempt.setTimeTaken(timeTakenSeconds);
        attempt.setCompletedAt(LocalDateTime.now());
        attempt.setStatus(expired ? Attempt.Status.EXPIRED : Attempt.Status.COMPLETED);

        attemptRepository.save(attempt);

        return new AttemptResultResponse(
                attempt.getId(),
                quiz.getTitle(),
                allQuestions.size(),
                correctCount,
                incorrectCount,
                unansweredCount,
                totalMarks,
                obtainedMarks,
                Math.round(percentage * 100.0) / 100.0,
                passed ? "PASSED" : "FAILED",
                timeTakenSeconds
        );
    }

    public List<AttemptSummaryResponse> getMyAttempts() {
        User user = currentUserService.getCurrentUser();
        List<Attempt> attempts = attemptRepository.findByUserId(user.getId());

        return attempts.stream()
                .filter(a -> a.getStatus() != Attempt.Status.IN_PROGRESS)
                .map(a -> new AttemptSummaryResponse(
                        a.getId(),
                        a.getQuiz().getTitle(),
                        a.getPercentage(),
                        a.getStatus().name(),
                        a.getCompletedAt()
                ))
                .collect(Collectors.toList());
    }

    public AttemptDetailResponse getAttemptDetail(Long attemptId) {
        User user = currentUserService.getCurrentUser();

        Attempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        if (!attempt.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("This attempt does not belong to you");
        }

        List<Answer> answers = answerRepository.findByAttemptId(attemptId);

        List<AnswerReviewResponse> reviews = answers.stream().map(ans -> {
            Question question = ans.getQuestion();
            List<Option> options = optionRepository.findByQuestionId(question.getId());
            String correctOptionText = options.stream()
                    .filter(Option::isCorrect)
                    .map(Option::getOptionText)
                    .findFirst()
                    .orElse(null);

            String selectedText = ans.getSelectedOption() != null ? ans.getSelectedOption().getOptionText() : null;

            return new AnswerReviewResponse(
                    question.getId(),
                    question.getQuestionText(),
                    selectedText,
                    correctOptionText,
                    question.getExplanation(),
                    ans.isCorrect()
            );
        }).collect(Collectors.toList());

        return new AttemptDetailResponse(
                attempt.getId(),
                attempt.getQuiz().getTitle(),
                answers.size(),
                attempt.getCorrectAnswers(),
                attempt.getIncorrectAnswers(),
                attempt.getUnanswered(),
                attempt.getPercentage(),
                attempt.getStatus().name(),
                attempt.getTimeTaken(),
                reviews
        );
    }
}