package com.quizplatform.backend.repository;

import com.quizplatform.backend.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Long> {
    List<Quiz> findByStatus(Quiz.Status status);
}