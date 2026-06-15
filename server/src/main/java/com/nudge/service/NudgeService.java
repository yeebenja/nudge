package com.nudge.service;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.nudge.model.Nudge;

@Service
public class NudgeService {

    private final LlmService llmService;
    private Nudge latest;

    public NudgeService(LlmService llmService) {
        this.llmService = llmService;
    }

    public Nudge createNudge(String complaint) {
        var suggestion = llmService.generateSuggestion(complaint);
        this.latest = new Nudge(complaint, suggestion);
        return this.latest;
    }

    public Optional<Nudge> getLatest() {
        return Optional.ofNullable(latest);
    }
}
