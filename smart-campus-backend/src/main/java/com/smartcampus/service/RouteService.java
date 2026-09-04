package com.smartcampus.service;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.dsa.CampusGraph;
import com.smartcampus.exception.Exceptions.*;
import com.smartcampus.mapper.CampusMapper;
import com.smartcampus.model.Location;
import com.smartcampus.model.Route;
import com.smartcampus.repository.LocationRepository;
import com.smartcampus.repository.RouteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class RouteService {

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private CampusMapper mapper;

    @Autowired
    private CampusGraph campusGraph;

    public RouteDTO createRoute(CreateRouteRequest req) {
        if (routeRepository.existsByRouteId(req.getRouteId())) {
            throw new DuplicateIdException("DUPLICATE_ID", "Route with ID " + req.getRouteId() + " already exists", "routeId");
        }

        if (req.getSourceLocationId().equals(req.getDestinationLocationId())) {
            throw new InvalidRouteException("Source and destination cannot be the same");
        }

        Location source = locationRepository.findByLocationId(req.getSourceLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Source location not found: " + req.getSourceLocationId()));
        Location dest = locationRepository.findByLocationId(req.getDestinationLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination location not found: " + req.getDestinationLocationId()));

        Route route = mapper.toEntity(req, source, dest);
        Route saved = routeRepository.save(route);

        campusGraph.addEdge(req.getSourceLocationId(), req.getDestinationLocationId(), req.getDistance(), req.isBidirectional());

        return mapper.toRouteDTO(saved);
    }

    public List<RouteDTO> getAllRoutes() {
        return routeRepository.findAll().stream()
                .map(mapper::toRouteDTO)
                .collect(Collectors.toList());
    }

    public RouteDTO getRouteById(String routeId) {
        return routeRepository.findByRouteId(routeId)
                .map(mapper::toRouteDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + routeId));
    }

    public RouteDTO updateRoute(String routeId, CreateRouteRequest req) {
        Route existing = routeRepository.findByRouteId(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + routeId));

        if (req.getSourceLocationId().equals(req.getDestinationLocationId())) {
            throw new InvalidRouteException("Source and destination cannot be the same");
        }

        Location source = locationRepository.findByLocationId(req.getSourceLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Source location not found: " + req.getSourceLocationId()));
        Location dest = locationRepository.findByLocationId(req.getDestinationLocationId())
                .orElseThrow(() -> new ResourceNotFoundException("Destination location not found: " + req.getDestinationLocationId()));

        campusGraph.removeEdge(existing.getSourceLocation().getLocationId(), existing.getDestinationLocation().getLocationId());

        mapper.updateEntity(existing, req, source, dest);
        Route saved = routeRepository.save(existing);

        campusGraph.addEdge(req.getSourceLocationId(), req.getDestinationLocationId(), req.getDistance(), req.isBidirectional());

        return mapper.toRouteDTO(saved);
    }

    public void deleteRoute(String routeId) {
        Route route = routeRepository.findByRouteId(routeId)
                .orElseThrow(() -> new ResourceNotFoundException("Route not found: " + routeId));
        
        campusGraph.removeEdge(route.getSourceLocation().getLocationId(), route.getDestinationLocation().getLocationId());
        routeRepository.delete(route);
    }
}
