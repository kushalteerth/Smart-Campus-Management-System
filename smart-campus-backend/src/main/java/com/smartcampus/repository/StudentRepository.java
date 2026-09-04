package com.smartcampus.repository;

import com.smartcampus.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(String userId);
    Optional<Student> findByStudentId(String studentId);
    boolean existsByStudentId(String studentId);
}
