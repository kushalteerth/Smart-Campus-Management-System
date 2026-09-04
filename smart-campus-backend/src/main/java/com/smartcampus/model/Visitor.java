package com.smartcampus.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "visitors")
@Data
@NoArgsConstructor
public class Visitor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "entry_time", nullable = false)
    private LocalDateTime entryTime = LocalDateTime.now();

    @Column(name = "exit_time")
    private LocalDateTime exitTime;

    @Column(length = 2000)
    private String feedback;
}
