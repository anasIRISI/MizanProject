package com.mizan.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.mizan.dto.AnalysisResponseDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiAiService(WebClient.Builder webClientBuilder, ObjectMapper objectMapper) {
        this.webClient = webClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public AnalysisResponseDTO analyzeDocument(MultipartFile file, String type, String lang) throws Exception {
        String base64Data = Base64.getEncoder().encodeToString(file.getBytes());
        String mimeType = file.getContentType() != null ? file.getContentType() : "application/pdf";

        String targetLanguage = "FRANCAIS";
        if ("en".equalsIgnoreCase(lang)) targetLanguage = "ANGLAIS";
        if ("ar".equalsIgnoreCase(lang)) targetLanguage = "ARABE";

        String systemInstruction = "Tu es un expert juridique. Analyse ce document. " +
                "Tu dois répondre STRICTEMENT au format JSON avec ces clés (qui doivent TOUJOURS RESTER en minuscules français) : " +
                "'resume' (paragraphe simple), 'droits' (tableau de strings), " +
                "'etapes_suivantes' (tableau de strings), et 'alerte_fraude' (string ou null si tout va bien). " +
                "ATTENTION CRITIQUE: Tout le texte, les phrases et les conseils que tu fournis en valeurs JSON DOIVENT ÊTRE RÉDIGÉS EN " + targetLanguage + ". ";

        if ("B2B".equalsIgnoreCase(type)) {
            systemInstruction += " L'utilisateur est un juriste d'entreprise. Adopte un ton formel et concentre-toi sur les risques contractuels, clauses abusives, la conformité légale et les pénalités.";
        } else {
            systemInstruction += " L'utilisateur est un citoyen. Utilise un langage clair, vulgarisé, et protège ses intérêts.";
        }

        Map<String, Object> requestBody = new HashMap<>();

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", systemInstruction);

        Map<String, Object> inlineData = new HashMap<>();
        inlineData.put("mimeType", mimeType);
        inlineData.put("data", base64Data);

        Map<String, Object> filePart = new HashMap<>();
        filePart.put("inlineData", inlineData);

        Map<String, Object> contentList = new HashMap<>();
        contentList.put("parts", List.of(textPart, filePart));

        requestBody.put("contents", List.of(contentList));

        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("response_mime_type", "application/json"); // Ensure JSON return
        requestBody.put("generationConfig", generationConfig);

        String response = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Extract JSON text from Gemini response
        // Expected format: { "candidates": [ { "content": { "parts": [ { "text": "{ \"resume\": ... }" } ] } } ] }
        try {
            Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) jsonResponse.get("candidates");
            Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
            String extractedJsonText = (String) parts.get(0).get("text");

            return objectMapper.readValue(extractedJsonText, AnalysisResponseDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de l'analyse ou du parsing de la réponse de l'IA: " + e.getMessage());
        }
    }

    public String generateLetter(String context) throws Exception {
        String systemInstruction = "Tu es un avocat expert. L'utilisateur a analysé un document et voici les résultats : " + context + 
                "\nRédige, au format TEXTE SIMPLE (pas de JSON, mais tu peux utiliser des retours à la ligne), une 'lettre recommandée avec accusé de réception' très formelle pour adresser les problèmes soulevés par cette analyse. C'est un brouillon que l'utilisateur complétera (laisse des espaces comme [Nom], [Date]). Sois précis, professionnel et juridique.";

        Map<String, Object> requestBody = new HashMap<>();

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", systemInstruction);

        Map<String, Object> contentList = new HashMap<>();
        contentList.put("parts", List.of(textPart));

        requestBody.put("contents", List.of(contentList));

        String response = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) jsonResponse.get("candidates");
            Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la génération de la lettre: " + e.getMessage());
        }
    }

    public String chat(String userMessage, String lang) throws Exception {
        String targetLanguage = "FRANCAIS";
        if ("en".equalsIgnoreCase(lang)) targetLanguage = "ANGLAIS";
        if ("ar".equalsIgnoreCase(lang)) targetLanguage = "ARABE";

        String systemInstruction = "Tu es 'Mizan', un assistant juridique intelligent et bienveillant intégré dans la plateforme en ligne Mizan Legal AI. " +
                "L'utilisateur discute avec toi pour poser des questions sur le droit ou sur l'utilisation de l'application Mizan. " +
                "Ton rôle est d'apporter des réponses courtes, directes et pertinentes. " +
                "ATTENTION CRITIQUE: Tu DOIS STRICTEMENT rédiger ta réponse en " + targetLanguage + ". Ne parle d'aucune autre langue que celle-là.\n" +
                "Voici le message (ou l'historique) envoyé par l'utilisateur :\n\n" + userMessage;

        Map<String, Object> requestBody = new HashMap<>();

        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", systemInstruction);

        Map<String, Object> contentList = new HashMap<>();
        contentList.put("parts", List.of(textPart));

        requestBody.put("contents", List.of(contentList));

        String response = webClient.post()
                .uri(apiUrl + "?key=" + apiKey)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            Map<String, Object> jsonResponse = objectMapper.readValue(response, Map.class);
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) jsonResponse.get("candidates");
            Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) contentMap.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la communication avec l'assistant: " + e.getMessage());
        }
    }
}
