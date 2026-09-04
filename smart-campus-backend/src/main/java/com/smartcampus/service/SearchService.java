package com.smartcampus.service;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.mapper.CampusMapper;
import com.smartcampus.repository.DepartmentRepository;
import com.smartcampus.repository.FacilityRepository;
import com.smartcampus.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class SearchService {

    @Autowired
    private LocationRepository locationRepository;
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private CampusMapper mapper;

    public Map<String, Object> globalSearch(String keyword, int page, int size) {
        Map<String, Object> results = new HashMap<>();
        
        PageRequest pageRequest = PageRequest.of(page, size);
        
        Page<LocationDTO> locations = locationRepository
                .findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(keyword, keyword, pageRequest)
                .map(mapper::toLocationDTO);
        
        Page<DepartmentDTO> departments = departmentRepository
                .findByNameContainingIgnoreCase(keyword, pageRequest)
                .map(mapper::toDepartmentDTO);
                
        Page<FacilityDTO> facilities = facilityRepository
                .findByNameContainingIgnoreCase(keyword, pageRequest)
                .map(mapper::toFacilityDTO);
                
        results.put("locations", locations);
        results.put("departments", departments);
        results.put("facilities", facilities);
        
        return results;
    }
}
