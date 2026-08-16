package com.quizplatform.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class SubmitAttemptRequest {
    private List<AnswerSubmission> answers;
}