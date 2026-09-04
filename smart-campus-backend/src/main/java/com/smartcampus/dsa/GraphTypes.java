package com.smartcampus.dsa;

import lombok.AllArgsConstructor;
import lombok.Data;

public class GraphTypes {

    @Data
    @AllArgsConstructor
    public static class GraphNode implements Comparable<GraphNode> {
        private String locationId;
        private double distance;

        @Override
        public int compareTo(GraphNode other) {
            return Double.compare(this.distance, other.distance);
        }
    }

    @Data
    @AllArgsConstructor
    public static class GraphEdge {
        private String destination;
        private double weight;
    }
}
