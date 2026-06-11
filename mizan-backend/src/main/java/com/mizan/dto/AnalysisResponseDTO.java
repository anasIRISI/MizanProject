package com.mizan.dto;

import lombok.Data;
import java.util.List;

@Data
public class AnalysisResponseDTO {
    private String resume;
    private List<String> droits;
    private List<String> etapes_suivantes;
    private String alerte_fraude;
}
