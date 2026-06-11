package com.mizan.repository;

import com.mizan.model.AnalysisRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalysisRecordRepository extends JpaRepository<AnalysisRecord, Long> {
    List<AnalysisRecord> findByUserIdOrderByCreatedAtDesc(Long userId);
}
