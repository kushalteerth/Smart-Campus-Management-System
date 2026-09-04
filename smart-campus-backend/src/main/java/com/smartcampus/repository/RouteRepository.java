package com.smartcampus.repository;

import com.smartcampus.model.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByRouteId(String routeId);
    boolean existsByRouteId(String routeId);

    @org.springframework.data.jpa.repository.Query("SELECT r FROM Route r JOIN FETCH r.sourceLocation JOIN FETCH r.destinationLocation")
    java.util.List<Route> findAllWithLocations();
}
