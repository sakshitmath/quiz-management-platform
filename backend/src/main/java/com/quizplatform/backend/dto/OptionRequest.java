package com.quizplatform.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class OptionRequest {
    private String optionText;

    @JsonProperty("isCorrect")
    private boolean isCorrect;
}