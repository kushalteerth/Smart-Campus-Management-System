package com.smartcampus.dsa;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class BFSTraversal {

    public boolean isReachable(CampusGraph graph, String sourceId, String destId) {
        if (!graph.hasVertex(sourceId) || !graph.hasVertex(destId)) return false;
        if (sourceId.equals(destId)) return true;
        
        Queue<String> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        
        queue.add(sourceId);
        visited.add(sourceId);
        
        while (!queue.isEmpty()) {
            String current = queue.poll();
            for (GraphTypes.GraphEdge edge : graph.getNeighbors(current)) {
                if (edge.getDestination().equals(destId)) return true;
                if (!visited.contains(edge.getDestination())) {
                    visited.add(edge.getDestination());
                    queue.add(edge.getDestination());
                }
            }
        }
        return false;
    }
    
    public List<String> getAllReachable(CampusGraph graph, String sourceId) {
        if (!graph.hasVertex(sourceId)) return new ArrayList<>();
        
        List<String> reachable = new ArrayList<>();
        Queue<String> queue = new LinkedList<>();
        Set<String> visited = new HashSet<>();
        
        queue.add(sourceId);
        visited.add(sourceId);
        
        while (!queue.isEmpty()) {
            String current = queue.poll();
            reachable.add(current);
            for (GraphTypes.GraphEdge edge : graph.getNeighbors(current)) {
                if (!visited.contains(edge.getDestination())) {
                    visited.add(edge.getDestination());
                    queue.add(edge.getDestination());
                }
            }
        }
        return reachable;
    }
}
