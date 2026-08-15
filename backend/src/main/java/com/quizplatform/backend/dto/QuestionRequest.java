package com.quizplatform.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class QuestionRequest {
    private String questionText;
    private Integer marks;
    private String explanation;
    private String difficulty; // EASY, INTERMEDIATE, HARD
    private List<OptionRequest> options;
}