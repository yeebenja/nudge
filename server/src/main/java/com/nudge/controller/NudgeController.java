package com.nudge.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.nudge.service.NudgeService;

@RestController
@RequestMapping("/api")
public class NudgeController {

    private final NudgeService nudgeService;

    public NudgeController(NudgeService nudgeService) {
        this.nudgeService = nudgeService;
    }

    @PostMapping("/nudge")
    public ResponseEntity<?> createNudge(@RequestBody Map<String, String> body) {
        var complaint = body.get("complaint");
        if (complaint == null || complaint.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "complaint is required"));
        }

        var nudge = nudgeService.createNudge(complaint);
        return ResponseEntity.ok(Map.of("suggestion", nudge.suggestion()));
    }

    @GetMapping("/nudge/latest")
    public ResponseEntity<?> getLatest() {
        return nudgeService.getLatest()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
