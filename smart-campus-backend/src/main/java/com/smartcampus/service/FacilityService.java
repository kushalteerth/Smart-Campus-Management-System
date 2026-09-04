package com.smartcampus.service;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.exception.Exceptions.*;
import com.smartcampus.mapper.CampusMapper;
import com.smartcampus.model.Facility;
import com.smartcampus.model.Location;
import com.smartcampus.repository.FacilityRepository;
import com.smartcampus.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FacilityService {

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private CampusMapper mapper;

    public FacilityDTO createFacility(CreateFacilityRequest req) {
        if (facilityRepository.existsByFacilityId(req.getFacilityId())) {
            throw new DuplicateIdException("DUPLICATE_ID", "Facility with ID " + req.getFacilityId() + " already exists", "facilityId");
        }
        Facility fac = new Facility();
        fac.setFacilityId(req.getFacilityId());
        fac.setName(req.getName());
        fac.setDescription(req.getDescription());
        fac.setFacilityType(req.getFacilityType());
        fac.setAvailable(req.isAvailable());

        if (req.getLocationId() != null && !req.getLocationId().isEmpty()) {
            Location loc = locationRepository.findByLocationId(req.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + req.getLocationId()));
            fac.setLocation(loc);
        }

        return mapper.toFacilityDTO(facilityRepository.save(fac));
    }

    public List<FacilityDTO> getAllFacilities() {
        return facilityRepository.findAll().stream()
                .map(mapper::toFacilityDTO)
                .collect(Collectors.toList());
    }

    public FacilityDTO getFacilityById(String facilityId) {
        return facilityRepository.findByFacilityId(facilityId)
                .map(mapper::toFacilityDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found: " + facilityId));
    }

    public FacilityDTO updateFacility(String facilityId, CreateFacilityRequest req) {
        Facility existing = facilityRepository.findByFacilityId(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found: " + facilityId));

        existing.setName(req.getName());
        existing.setDescription(req.getDescription());
        existing.setFacilityType(req.getFacilityType());
        existing.setAvailable(req.isAvailable());

        if (req.getLocationId() != null && !req.getLocationId().isEmpty()) {
            Location loc = locationRepository.findByLocationId(req.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + req.getLocationId()));
            existing.setLocation(loc);
        } else {
            existing.setLocation(null);
        }

        return mapper.toFacilityDTO(facilityRepository.save(existing));
    }

    public void deleteFacility(String facilityId) {
        Facility fac = facilityRepository.findByFacilityId(facilityId)
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found: " + facilityId));
        facilityRepository.delete(fac);
    }
}
