package com.nudge.service;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class LlmService {

    private static final Logger log = LoggerFactory.getLogger(LlmService.class);

    private static final String SYSTEM_PROMPT = """
            Convert this complaint into 3 bullet-point suggestions for the boyfriend.
            Each: 1 sentence, actionable, empathetic. No preamble or closing.
            """;

    private final RestClient restClient;
    private final String model;
    private final boolean enabled;

    public LlmService(
            RestClient.Builder restClientBuilder,
            @Value("${ollama.model:qwen2.5:7b}") String model,
            @Value("${ollama.enabled:false}") boolean enabled) {
        this.model = model;
        this.enabled = enabled;
        this.restClient = restClientBuilder
                .baseUrl("http://localhost:11434")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String generateSuggestion(String complaint) {
        if (!enabled) {
            return defaultSuggestion(complaint);
        }

        try {
            var request = Map.of(
                    "model", model,
                    "stream", false,
                    "messages", List.of(
                            Map.of("role", "system", "content", SYSTEM_PROMPT),
                            Map.of("role", "user", "content", complaint)));

            var response = restClient.post()
                    .uri("/api/chat")
                    .body(request)
                    .retrieve()
                    .body(ChatResponse.class);

            if (response == null || response.message() == null || response.message().content() == null) {
                return defaultSuggestion(complaint);
            }

            return response.message().content();
        } catch (Exception e) {
            log.warn("Ollama call failed, using fallback: {}", e.getMessage());
            return defaultSuggestion(complaint);
        }
    }

    private String defaultSuggestion(String complaint) {
        return "Talk to your partner about: " + complaint;
    }

    private record ChatResponse(Message message, boolean done) {
    }

    private record Message(String content) {
    }
}
