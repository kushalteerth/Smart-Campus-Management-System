package com.smartcampus.service;

import com.smartcampus.dto.user.UserDTOs.*;
import com.smartcampus.exception.Exceptions.*;
import com.smartcampus.mapper.UserMapper;
import com.smartcampus.model.Admin;
import com.smartcampus.model.Role;
import com.smartcampus.repository.AdminRepository;
import com.smartcampus.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper mapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AdminDTO createAdmin(CreateAdminRequest req) {
        if (userRepository.existsByUserId(req.getUserId())) {
            throw new DuplicateIdException("DUPLICATE_ID", "User with ID " + req.getUserId() + " already exists", "userId");
        }
        if (userRepository.existsByUsername(req.getUsername())) {
            throw new DuplicateIdException("DUPLICATE_USERNAME", "Username " + req.getUsername() + " is already taken", "username");
        }

        Admin admin = new Admin();
        admin.setUserId(req.getUserId());
        admin.setFullName(req.getFullName());
        admin.setUsername(req.getUsername());
        admin.setPassword(passwordEncoder.encode(req.getPassword()));
        admin.setRole(Role.ADMIN);
        admin.setDepartment(req.getDepartment());
        admin.setEmail(req.getEmail());

        return mapper.toAdminDTO(adminRepository.save(admin));
    }

    public List<AdminDTO> getAllAdmins() {
        return adminRepository.findAll().stream()
                .map(mapper::toAdminDTO)
                .collect(Collectors.toList());
    }

    public AdminDTO getAdminById(String userId) {
        return adminRepository.findByUserId(userId)
                .map(mapper::toAdminDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found: " + userId));
    }

    public void deleteAdmin(String userId) {
        Admin admin = adminRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found: " + userId));
        adminRepository.delete(admin);
    }
}
