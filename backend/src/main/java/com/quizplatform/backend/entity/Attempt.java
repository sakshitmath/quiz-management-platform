package com.quizplatform.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "attempts")
@Data
public class Attempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private Integer score = 0;

    private Double percentage = 0.0;

    @Column(name = "correct_answers")
    private Integer correctAnswers = 0;

    @Column(name = "incorrect_answers")
    private Integer incorrectAnswers = 0;

    private Integer unanswered = 0;

    @Column(name = "time_taken")
    private Integer timeTaken; // seconds

    @Enumerated(EnumType.STRING)
    private Status status = Status.IN_PROGRESS;

    @Column(name = "started_at")
    private LocalDateTime startedAt = LocalDateTime.now();

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    public enum Status { IN_PROGRESS, COMPLETED, EXPIRED }
}