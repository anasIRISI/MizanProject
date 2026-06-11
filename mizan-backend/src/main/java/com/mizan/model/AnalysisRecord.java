package com.mizan.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "analysis_records")
@Data
public class AnalysisRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String documentName;

    @Column(columnDefinition = "TEXT")
    private String resume;

    @Column(columnDefinition = "JSON")
    private String droitsJson;

    @Column(columnDefinition = "JSON")
    private String etapesSuivantesJson;

    @Column(columnDefinition = "TEXT")
    private String alerteFraude;

    private String type; // B2C or B2B

    private LocalDateTime createdAt = LocalDateTime.now();
}
