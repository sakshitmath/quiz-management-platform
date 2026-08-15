package com.quizplatform.backend.repository;

import com.quizplatform.backend.entity.Attempt;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttemptRepository extends JpaRepository<Attempt, Long> {
    List<Attempt> findByUserId(Long userId);
    List<Attempt> findByQuizIdAndUserId(Long quizId, Long userId);
}