package com.quizplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class QuestionResponse {
    private Long id;
    private String questionText;
    private Integer marks;
    private List<OptionResponse> options;
    // NOTE: explanation and correct answer deliberately excluded during attempt
}