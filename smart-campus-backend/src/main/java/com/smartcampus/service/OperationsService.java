package com.smartcampus.service;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.exception.Exceptions.*;
import com.smartcampus.mapper.CampusMapper;
import com.smartcampus.model.Location;
import com.smartcampus.model.Operations;
import com.smartcampus.repository.LocationRepository;
import com.smartcampus.repository.OperationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class OperationsService {

    @Autowired
    private OperationsRepository operationsRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private CampusMapper mapper;

    public OperationsDTO createOperations(CreateOperationsRequest req) {
        if (operationsRepository.existsByOperationId(req.getOperationId())) {
            throw new DuplicateIdException("DUPLICATE_ID", "Operations with ID " + req.getOperationId() + " already exists", "operationId");
        }
        Operations op = new Operations();
        op.setOperationId(req.getOperationId());
        op.setName(req.getName());
        op.setDescription(req.getDescription());
        op.setStatus(req.getStatus());
        op.setOperatingHours(req.getOperatingHours());

        if (req.getLocationId() != null && !req.getLocationId().isEmpty()) {
            Location loc = locationRepository.findByLocationId(req.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + req.getLocationId()));
            op.setLocation(loc);
        }

        return mapper.toOperationsDTO(operationsRepository.save(op));
    }

    public List<OperationsDTO> getAllOperations() {
        return operationsRepository.findAll().stream()
                .map(mapper::toOperationsDTO)
                .collect(Collectors.toList());
    }

    public OperationsDTO getOperationsById(String operationId) {
        return operationsRepository.findByOperationId(operationId)
                .map(mapper::toOperationsDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Operations not found: " + operationId));
    }

    public OperationsDTO updateOperations(String operationId, CreateOperationsRequest req) {
        Operations existing = operationsRepository.findByOperationId(operationId)
                .orElseThrow(() -> new ResourceNotFoundException("Operations not found: " + operationId));

        existing.setName(req.getName());
        existing.setDescription(req.getDescription());
        existing.setStatus(req.getStatus());
        existing.setOperatingHours(req.getOperatingHours());

        if (req.getLocationId() != null && !req.getLocationId().isEmpty()) {
            Location loc = locationRepository.findByLocationId(req.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + req.getLocationId()));
            existing.setLocation(loc);
        } else {
            existing.setLocation(null);
        }

        return mapper.toOperationsDTO(operationsRepository.save(existing));
    }

    public void deleteOperations(String operationId) {
        Operations op = operationsRepository.findByOperationId(operationId)
                .orElseThrow(() -> new ResourceNotFoundException("Operations not found: " + operationId));
        operationsRepository.delete(op);
    }
}
