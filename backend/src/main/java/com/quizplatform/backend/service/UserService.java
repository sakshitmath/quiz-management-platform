package com.quizplatform.backend.service;

import com.quizplatform.backend.dto.UserSummaryResponse;
import com.quizplatform.backend.entity.Attempt;
import com.quizplatform.backend.entity.User;
import com.quizplatform.backend.repository.AttemptRepository;
import com.quizplatform.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import com.quizplatform.backend.dto.LeaderboardEntry;
import java.util.Comparator;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AttemptRepository attemptRepository;

    public UserService(UserRepository userRepository, AttemptRepository attemptRepository) {
        this.userRepository = userRepository;
        this.attemptRepository = attemptRepository;
    }

    public List<UserSummaryResponse> getAllStudents() {
        List<User> students = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.STUDENT)
                .collect(Collectors.toList());

        return students.stream().map(this::toSummary).collect(Collectors.toList());
    }

    public UserSummaryResponse toggleActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setActive(!user.isActive());
        userRepository.save(user);
        return toSummary(user);
    }

    private UserSummaryResponse toSummary(User user) {
        List<Attempt> attempts = attemptRepository.findByUserId(user.getId()).stream()
                .filter(a -> a.getStatus() == Attempt.Status.COMPLETED)
                .collect(Collectors.toList());

        int count = attempts.size();
        double avgScore = count == 0 ? 0.0 :
                attempts.stream().mapToDouble(Attempt::getPercentage).average().orElse(0.0);

        return new UserSummaryResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.isActive(),
                user.getCreatedAt(),
                count,
                Math.round(avgScore * 100.0) / 100.0
        );
    }

    public List<LeaderboardEntry> getLeaderboard() {
        List<User> students = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.STUDENT)
                .toList();

        return students.stream()
                .map(u -> {
                    List<Attempt> completed = attemptRepository.findByUserId(u.getId()).stream()
                            .filter(a -> a.getStatus() == Attempt.Status.COMPLETED)
                            .toList();

                    double avg = completed.isEmpty() ? 0.0 :
                            completed.stream().mapToDouble(Attempt::getPercentage).average().orElse(0.0);

                    return new LeaderboardEntry(u.getId(), u.getName(), Math.round(avg * 100.0) / 100.0, completed.size());
                })
                .filter(entry -> entry.getQuizzesCompleted() > 0)
                .sorted(Comparator.comparingDouble(LeaderboardEntry::getAverageScore).reversed())
                .toList();
    }
}