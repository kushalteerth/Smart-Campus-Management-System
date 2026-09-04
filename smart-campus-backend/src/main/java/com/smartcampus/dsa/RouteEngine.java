package com.smartcampus.dsa;

import com.smartcampus.dto.route.RouteDTOs.RouteFinderResponse;
import com.smartcampus.model.Location;
import com.smartcampus.repository.LocationRepository;
import com.smartcampus.repository.RouteRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RouteEngine {
    
    private static final Logger log = LoggerFactory.getLogger(RouteEngine.class);

    @Autowired
    private CampusGraph campusGraph;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private RouteRepository routeRepository;

    @Autowired
    private BFSTraversal bfsTraversal;

    @Autowired
    private DijkstraAlgorithm dijkstraAlgorithm;

    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    @PostConstruct
    public void initializeGraph() {
        try {
            locationRepository.findAll().forEach(loc ->
                campusGraph.addVertex(loc.getLocationId()));
            
            routeRepository.findAllWithLocations().forEach(route ->
                campusGraph.addEdge(
                    route.getSourceLocation().getLocationId(),
                    route.getDestinationLocation().getLocationId(),
                    route.getDistance(),
                    route.isBidirectional()
                ));
                
            log.info("Campus graph initialized with {} vertices", campusGraph.getVertexCount());
        } catch (Exception e) {
            log.warn("Could not initialize graph, database might not be ready. Error: {}", e.getMessage());
        }
    }

    public RouteFinderResponse findShortestPath(String sourceId, String destId) {
        boolean reachable = bfsTraversal.isReachable(campusGraph, sourceId, destId);
        if (!reachable) {
            return RouteFinderResponse.noPath(sourceId, destId);
        }

        RouteResult result = dijkstraAlgorithm.findShortestPath(campusGraph, sourceId, destId);

        if (!result.isReachable() || result.getPath().isEmpty()) {
            return RouteFinderResponse.noPath(sourceId, destId);
        }

        List<String> pathNames = result.getPath().stream()
            .map(id -> locationRepository.findByLocationId(id)
                .map(Location::getName).orElse(id))
            .collect(Collectors.toList());

        return new RouteFinderResponse(result.getPath(), pathNames, result.getTotalDistance(), true, "Dijkstra", "Path found successfully");
    }
    
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public void refreshGraph() {
        campusGraph.clear();
        initializeGraph();
    }
}
