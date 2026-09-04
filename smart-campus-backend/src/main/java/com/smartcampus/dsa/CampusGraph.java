package com.smartcampus.dsa;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class CampusGraph {
    
    private final HashMap<String, List<GraphTypes.GraphEdge>> adjacencyList = new HashMap<>();
    private final HashSet<String> vertices = new HashSet<>();
    
    public void addVertex(String locationId) {
        if (!vertices.contains(locationId)) {
            vertices.add(locationId);
            adjacencyList.put(locationId, new ArrayList<>());
        }
    }
    
    public void addEdge(String source, String dest, double weight, boolean bidirectional) {
        if (!vertices.contains(source)) addVertex(source);
        if (!vertices.contains(dest)) addVertex(dest);
        
        adjacencyList.get(source).add(new GraphTypes.GraphEdge(dest, weight));
        if (bidirectional) {
            adjacencyList.get(dest).add(new GraphTypes.GraphEdge(source, weight));
        }
    }
    
    public void removeVertex(String locationId) {
        vertices.remove(locationId);
        adjacencyList.remove(locationId);
        
        // Remove all edges pointing to this vertex
        for (List<GraphTypes.GraphEdge> edges : adjacencyList.values()) {
            edges.removeIf(edge -> edge.getDestination().equals(locationId));
        }
    }
    
    public void removeEdge(String source, String dest) {
        if (adjacencyList.containsKey(source)) {
            adjacencyList.get(source).removeIf(edge -> edge.getDestination().equals(dest));
        }
        if (adjacencyList.containsKey(dest)) {
            adjacencyList.get(dest).removeIf(edge -> edge.getDestination().equals(source));
        }
    }

    public List<GraphTypes.GraphEdge> getNeighbors(String locationId) {
        return adjacencyList.getOrDefault(locationId, new ArrayList<>());
    }
    
    public boolean hasVertex(String locationId) {
        return vertices.contains(locationId);
    }
    
    public Set<String> getAllVertices() {
        return vertices;
    }
    
    public int getVertexCount() {
        return vertices.size();
    }
    
    public void clear() {
        vertices.clear();
        adjacencyList.clear();
    }
}
