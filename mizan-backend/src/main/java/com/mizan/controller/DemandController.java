package com.mizan.controller;

import com.mizan.model.Demand;
import com.mizan.model.User;
import com.mizan.repository.DemandRepository;
import com.mizan.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/demands")
public class DemandController {

    private final DemandRepository demandRepository;
    private final UserRepository userRepository;

    public DemandController(DemandRepository demandRepository, UserRepository userRepository) {
        this.demandRepository = demandRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<?> createDemand(@RequestBody Demand demand) {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (userDetails == null) return ResponseEntity.status(401).body("Non autorisé");
            
            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            
            demand.setUserId(user.getId());
            demand.setStatus("attente");
            demand.setSubmittedAt(LocalDateTime.now());
            
            Demand savedDemand = demandRepository.save(demand);
            return ResponseEntity.ok(savedDemand);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur lors de la création de la demande: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserDemands() {
        try {
            UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            if (userDetails == null) return ResponseEntity.status(401).body("Non autorisé");

            User user = userRepository.findByEmail(userDetails.getUsername()).orElseThrow();
            
            List<Demand> demands = demandRepository.findByUserIdOrderBySubmittedAtDesc(user.getId());
            return ResponseEntity.ok(demands);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Erreur: " + e.getMessage());
        }
    }
}
