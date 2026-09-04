package com.smartcampus.repository;

import com.smartcampus.model.Operations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OperationsRepository extends JpaRepository<Operations, Long> {
    Optional<Operations> findByOperationId(String operationId);
    boolean existsByOperationId(String operationId);
}
