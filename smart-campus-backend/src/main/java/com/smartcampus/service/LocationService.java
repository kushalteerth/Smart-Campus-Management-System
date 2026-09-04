package com.smartcampus.service;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.dsa.CampusGraph;
import com.smartcampus.exception.Exceptions.*;
import com.smartcampus.mapper.CampusMapper;
import com.smartcampus.model.Location;
import com.smartcampus.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LocationService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private CampusMapper mapper;

    @Autowired
    private CampusGraph campusGraph;

    public LocationDTO createLocation(CreateLocationRequest req) {
        if (locationRepository.existsByLocationId(req.getLocationId())) {
            throw new DuplicateIdException("DUPLICATE_ID", "Location with ID " + req.getLocationId() + " already exists", "locationId");
        }
        Location location = mapper.toEntity(req);
        Location saved = locationRepository.save(location);
        campusGraph.addVertex(saved.getLocationId());
        return mapper.toLocationDTO(saved);
    }

    public List<LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(mapper::toLocationDTO)
                .collect(Collectors.toList());
    }

    public LocationDTO getLocationById(String locationId) {
        return locationRepository.findByLocationId(locationId)
                .map(mapper::toLocationDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + locationId));
    }

    public LocationDTO updateLocation(String locationId, CreateLocationRequest req) {
        Location existing = locationRepository.findByLocationId(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + locationId));
        
        if (!existing.getLocationId().equals(req.getLocationId()) && locationRepository.existsByLocationId(req.getLocationId())) {
            throw new DuplicateIdException("DUPLICATE_ID", "Location with ID " + req.getLocationId() + " already exists", "locationId");
        }

        mapper.updateEntity(existing, req);
        return mapper.toLocationDTO(locationRepository.save(existing));
    }

    public void deleteLocation(String locationId) {
        Location location = locationRepository.findByLocationId(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + locationId));
        campusGraph.removeVertex(locationId);
        locationRepository.delete(location);
    }
}
