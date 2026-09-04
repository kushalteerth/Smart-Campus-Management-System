package com.smartcampus.dsa;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class RouteResult {
    private List<String> path;
    private double totalDistance;
    private boolean reachable;

    public static RouteResult unreachable() {
        return new RouteResult(new ArrayList<>(), 0.0, false);
    }
}
