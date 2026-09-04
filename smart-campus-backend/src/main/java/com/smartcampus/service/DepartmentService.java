package com.smartcampus.service;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.exception.Exceptions.*;
import com.smartcampus.mapper.CampusMapper;
import com.smartcampus.model.Department;
import com.smartcampus.model.Location;
import com.smartcampus.repository.DepartmentRepository;
import com.smartcampus.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private CampusMapper mapper;

    public DepartmentDTO createDepartment(CreateDepartmentRequest req) {
        if (departmentRepository.existsByDepartmentId(req.getDepartmentId())) {
            throw new DuplicateIdException("DUPLICATE_ID", "Department with ID " + req.getDepartmentId() + " already exists", "departmentId");
        }
        Department dept = new Department();
        dept.setDepartmentId(req.getDepartmentId());
        dept.setName(req.getName());
        dept.setDescription(req.getDescription());
        dept.setHeadOfDept(req.getHeadOfDept());
        dept.setFacilities(req.getFacilities());
        dept.setPurpose(req.getPurpose());
        dept.setTiming(req.getTiming());

        if (req.getLocationId() != null && !req.getLocationId().isEmpty()) {
            Location loc = locationRepository.findByLocationId(req.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + req.getLocationId()));
            dept.setLocation(loc);
        }

        return mapper.toDepartmentDTO(departmentRepository.save(dept));
    }

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(mapper::toDepartmentDTO)
                .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(String departmentId) {
        return departmentRepository.findByDepartmentId(departmentId)
                .map(mapper::toDepartmentDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + departmentId));
    }

    public DepartmentDTO updateDepartment(String departmentId, CreateDepartmentRequest req) {
        Department existing = departmentRepository.findByDepartmentId(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + departmentId));

        existing.setName(req.getName());
        existing.setDescription(req.getDescription());
        existing.setHeadOfDept(req.getHeadOfDept());
        existing.setFacilities(req.getFacilities());
        existing.setPurpose(req.getPurpose());
        existing.setTiming(req.getTiming());

        if (req.getLocationId() != null && !req.getLocationId().isEmpty()) {
            Location loc = locationRepository.findByLocationId(req.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + req.getLocationId()));
            existing.setLocation(loc);
        } else {
            existing.setLocation(null);
        }

        return mapper.toDepartmentDTO(departmentRepository.save(existing));
    }

    public void deleteDepartment(String departmentId) {
        Department dept = departmentRepository.findByDepartmentId(departmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found: " + departmentId));
        departmentRepository.delete(dept);
    }
}
