package com.smartcampus.mapper;

import com.smartcampus.dto.user.UserDTOs.*;
import com.smartcampus.model.Admin;
import com.smartcampus.model.Student;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public AdminDTO toAdminDTO(Admin admin) {
        if (admin == null) return null;
        AdminDTO dto = new AdminDTO();
        dto.setId(admin.getId());
        dto.setUserId(admin.getUserId());
        dto.setFullName(admin.getFullName());
        dto.setUsername(admin.getUsername());
        dto.setRole(admin.getRole() != null ? admin.getRole().name() : null);
        dto.setDepartment(admin.getDepartment());
        dto.setEmail(admin.getEmail());
        return dto;
    }

    public StudentDTO toStudentDTO(Student student) {
        if (student == null) return null;
        StudentDTO dto = new StudentDTO();
        dto.setId(student.getId());
        dto.setUserId(student.getUserId());
        dto.setStudentId(student.getStudentId());
        dto.setFullName(student.getFullName());
        dto.setUsername(student.getUsername());
        dto.setRole(student.getRole() != null ? student.getRole().name() : null);
        dto.setProgram(student.getProgram());
        dto.setDepartment(student.getDepartment());
        dto.setSection(student.getSection());
        dto.setYear(student.getYear());
        return dto;
    }
}
