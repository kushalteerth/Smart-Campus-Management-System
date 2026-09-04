package com.smartcampus.repository;

import com.smartcampus.model.Department;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByDepartmentId(String departmentId);
    boolean existsByDepartmentId(String departmentId);
    
    Page<Department> findByNameContainingIgnoreCase(String name, Pageable pageable);
}
