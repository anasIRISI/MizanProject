package com.mizan.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mizan.dto.AnalysisResponseDTO;
import com.mizan.model.AnalysisRecord;
import com.mizan.repository.AnalysisRecordRepository;
import com.mizan.service.GeminiAiService;
import com.mizan.model.User;
import com.mizan.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class AnalysisController {

    private final GeminiAiService geminiAiService;
    private final AnalysisRecordRepository analysisRecordRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    public AnalysisController(GeminiAiService geminiAiService, AnalysisRecordRepository analysisRecordRepository, UserRepository userRepository, ObjectMapper objectMapper) {
        this.geminiAiService = geminiAiService;
        this.analysisRecordRepository = analysisRecordRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeDocument(
            @RequestParam("file") MultipartFile file,
            @RequestParam("type") String type,
            @RequestParam(value = "lang", defaultValue = "fr") String lang) {

        try {
            // Get Current Authenticated User
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            Long authenticatedUserId = user.getId();

            // Call Gemini
            AnalysisResponseDTO result = geminiAiService.analyzeDocument(file, type, lang);

            // Save to DB
            AnalysisRecord record = new AnalysisRecord();
            record.setUserId(authenticatedUserId);
            record.setDocumentName(file.getOriginalFilename());
            record.setResume(result.getResume());
            record.setDroitsJson(objectMapper.writeValueAsString(result.getDroits()));
            record.setEtapesSuivantesJson(objectMapper.writeValueAsString(result.getEtapes_suivantes()));
            record.setAlerteFraude(result.getAlerte_fraude());
            record.setType(type);

            analysisRecordRepository.save(record);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur lors de l'analyse : " + e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
        Long authenticatedUserId = user.getId();

        List<AnalysisRecord> history = analysisRecordRepository.findByUserIdOrderByCreatedAtDesc(authenticatedUserId);
        return ResponseEntity.ok(history);
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<?> deleteHistory(@PathVariable Long id) {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            
            AnalysisRecord record = analysisRecordRepository.findById(id).orElse(null);
            if (record == null) {
                return ResponseEntity.notFound().build();
            }
            if (!record.getUserId().equals(user.getId())) {
                return ResponseEntity.status(403).body("Non autorisé à supprimer cet élément.");
            }
            
            analysisRecordRepository.deleteById(id);
            return ResponseEntity.ok("Élément supprimé avec succès.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur: " + e.getMessage());
        }
    }

    @PostMapping("/generate-letter")
    public ResponseEntity<?> generateLetter(@RequestBody java.util.Map<String, String> payload) {
        try {
            // Verify Authentication
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (userDetails == null) {
                return ResponseEntity.status(401).body("Non autorisé");
            }

            String context = payload.get("context");
            if (context == null || context.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le contexte est requis.");
            }

            String letter = geminiAiService.generateLetter(context);
            return ResponseEntity.ok(java.util.Map.of("letter", letter));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur lors de la génération de la lettre : " + e.getMessage());
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody java.util.Map<String, String> payload) {
        try {
            // Optionnel : vérifier auth si on veut restreindre le chat aux utilisateurs connectés.
            String message = payload.get("message");
            String lang = payload.getOrDefault("lang", "fr");

            if (message == null || message.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Le message est requis.");
            }

            String response = geminiAiService.chat(message, lang);
            return ResponseEntity.ok(java.util.Map.of("response", response));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Erreur lors de la communication avec le chat : " + e.getMessage());
        }
    }
}
