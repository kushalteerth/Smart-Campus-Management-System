package com.smartcampus.service;

import com.smartcampus.dto.user.UserDTOs.*;
import com.smartcampus.exception.Exceptions.*;
import com.smartcampus.mapper.UserMapper;
import com.smartcampus.model.Role;
import com.smartcampus.model.Student;
import com.smartcampus.repository.StudentRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class StudentManagementService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper mapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public StudentDTO createStudent(CreateStudentRequest req) {
        if (studentRepository.existsByStudentId(req.getStudentId())) {
            throw new DuplicateIdException("DUPLICATE_ID", "Student with ID " + req.getStudentId() + " already exists", "studentId");
        }
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new DuplicateIdException("DUPLICATE_USERNAME", "Username " + req.getUsername() + " is already taken", "username");
        }

        Student student = new Student();
        // Domain specific ID for User base class (we can use studentId for both, or prefix it)
        student.setUserId("S_" + req.getStudentId()); 
        student.setFullName(req.getFullName());
        student.setUsername(req.getUsername());
        student.setPassword(passwordEncoder.encode(req.getPassword()));
        student.setRole(Role.STUDENT);
        
        student.setStudentId(req.getStudentId());
        student.setProgram(req.getProgram());
        student.setDepartment(req.getDepartment());
        student.setSection(req.getSection());
        student.setYear(req.getYear());

        return mapper.toStudentDTO(studentRepository.save(student));
    }

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(mapper::toStudentDTO)
                .collect(Collectors.toList());
    }

    public StudentDTO getStudentById(String studentId) {
        return studentRepository.findByStudentId(studentId)
                .or(() -> studentRepository.findByUserId(studentId))
                .map(mapper::toStudentDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
    }

    public void deleteStudent(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        studentRepository.delete(student);
    }
}
