package com.quizplatform.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OptionResponse {
    private Long id;
    private String optionText;
    // NOTE: isCorrect deliberately excluded — students must never see this
}