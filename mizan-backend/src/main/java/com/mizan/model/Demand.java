package com.mizan.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "demands")
public class Demand {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String lawyerName;

    private String lawyerImage;

    @Column(nullable = false)
    private String subject;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String date; // "datetime-local" string or formatted date

    @Column(nullable = false)
    private String status = "attente";

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedAt = LocalDateTime.now();

    public Demand() {}

    // Getters
    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getLawyerName() { return lawyerName; }
    public String getLawyerImage() { return lawyerImage; }
    public String getSubject() { return subject; }
    public String getMessage() { return message; }
    public String getDate() { return date; }
    public String getStatus() { return status; }
    public LocalDateTime getSubmittedAt() { return submittedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setUserId(Long userId) { this.userId = userId; }
    public void setLawyerName(String lawyerName) { this.lawyerName = lawyerName; }
    public void setLawyerImage(String lawyerImage) { this.lawyerImage = lawyerImage; }
    public void setSubject(String subject) { this.subject = subject; }
    public void setMessage(String message) { this.message = message; }
    public void setDate(String date) { this.date = date; }
    public void setStatus(String status) { this.status = status; }
    public void setSubmittedAt(LocalDateTime submittedAt) { this.submittedAt = submittedAt; }
}
