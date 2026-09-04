package com.smartcampus.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "locations")
@Data
@NoArgsConstructor
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "location_id", unique = true, nullable = false)
    private String locationId;

    @Column(nullable = false)
    private String name;

    @Column(length = 5000)
    private String description;

    @Column
    private String building;

    @Column
    private String floor;

    @Column
    private String department;

    @Column
    private Double distance;

    @Column
    private String status = "OPEN";

    @Column(name = "opening_time")
    private LocalTime openingTime;

    @Column(name = "closing_time")
    private LocalTime closingTime;

    @OneToMany(mappedBy = "sourceLocation", cascade = CascadeType.ALL)
    private List<Route> outgoingRoutes = new ArrayList<>();

    @OneToMany(mappedBy = "destinationLocation", cascade = CascadeType.ALL)
    private List<Route> incomingRoutes = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
