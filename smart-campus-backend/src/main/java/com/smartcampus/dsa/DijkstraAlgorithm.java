package com.smartcampus.dsa;

import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class DijkstraAlgorithm {

    public RouteResult findShortestPath(CampusGraph graph, String sourceId, String destId) {
        if (!graph.hasVertex(sourceId) || !graph.hasVertex(destId)) {
            return RouteResult.unreachable();
        }

        HashMap<String, Double> distances = new HashMap<>();
        HashMap<String, String> predecessors = new HashMap<>();
        
        for (String vertex : graph.getAllVertices()) {
            distances.put(vertex, Double.MAX_VALUE);
        }
        distances.put(sourceId, 0.0);
        
        PriorityQueue<GraphTypes.GraphNode> pq = new PriorityQueue<>(
            Comparator.comparingDouble(GraphTypes.GraphNode::getDistance)
        );
        pq.add(new GraphTypes.GraphNode(sourceId, 0.0));
        
        Set<String> settled = new HashSet<>();
        
        while (!pq.isEmpty()) {
            GraphTypes.GraphNode current = pq.poll();
            String currentId = current.getLocationId();
            
            if (settled.contains(currentId)) continue;
            settled.add(currentId);
            
            if (currentId.equals(destId)) break;
            
            for (GraphTypes.GraphEdge edge : graph.getNeighbors(currentId)) {
                String neighbor = edge.getDestination();
                double newDist = distances.get(currentId) + edge.getWeight();
                
                if (newDist < distances.getOrDefault(neighbor, Double.MAX_VALUE)) {
                    distances.put(neighbor, newDist);
                    predecessors.put(neighbor, currentId);
                    pq.add(new GraphTypes.GraphNode(neighbor, newDist));
                }
            }
        }
        
        if (distances.get(destId) == Double.MAX_VALUE) {
            return RouteResult.unreachable();
        }
        
        List<String> path = reconstructPath(predecessors, sourceId, destId);
        return new RouteResult(path, distances.get(destId), true);
    }
    
    private List<String> reconstructPath(HashMap<String, String> predecessors, String source, String dest) {
        List<String> path = new ArrayList<>();
        String current = dest;
        while (current != null) {
            path.add(0, current);
            current = predecessors.get(current);
        }
        return path;
    }
}
