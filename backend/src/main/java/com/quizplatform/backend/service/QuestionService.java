package com.quizplatform.backend.service;

import com.quizplatform.backend.dto.OptionRequest;
import com.quizplatform.backend.dto.QuestionRequest;
import com.quizplatform.backend.entity.Option;
import com.quizplatform.backend.entity.Question;
import com.quizplatform.backend.entity.Quiz;
import com.quizplatform.backend.repository.OptionRepository;
import com.quizplatform.backend.repository.QuestionRepository;
import com.quizplatform.backend.repository.QuizRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuizRepository quizRepository;
    private final OptionRepository optionRepository;

    public QuestionService(QuestionRepository questionRepository, QuizRepository quizRepository, OptionRepository optionRepository) {
        this.questionRepository = questionRepository;
        this.quizRepository = quizRepository;
        this.optionRepository = optionRepository;
    }

    public List<Question> getByQuizId(Long quizId) {
        return questionRepository.findByQuizId(quizId);
    }

    public Question create(Long quizId, QuestionRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));

        if (request.getOptions() == null || request.getOptions().size() < 2) {
            throw new RuntimeException("A question needs at least 2 options");
        }

        long correctCount = request.getOptions().stream().filter(OptionRequest::isCorrect).count();
        if (correctCount != 1) {
            throw new RuntimeException("Exactly one option must be marked correct");
        }

        Question question = new Question();
        question.setQuiz(quiz);
        question.setQuestionText(request.getQuestionText());
        question.setMarks(request.getMarks());
        question.setExplanation(request.getExplanation());
        question.setDifficulty(Quiz.Difficulty.valueOf(request.getDifficulty()));

        Question savedQuestion = questionRepository.save(question);

        List<Option> options = request.getOptions().stream().map(o -> {
            Option option = new Option();
            option.setQuestion(savedQuestion);
            option.setOptionText(o.getOptionText());
            option.setCorrect(o.isCorrect());
            return option;
        }).collect(Collectors.toList());

        optionRepository.saveAll(options);

        return savedQuestion;
    }

    public void delete(Long id) {
        if (!questionRepository.existsById(id)) {
            throw new RuntimeException("Question not found");
        }
        questionRepository.deleteById(id);
    }
}