package com.smartcampus.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "students")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Student extends User {

    @Column(name = "student_id", nullable = false, unique = true)
    private String studentId;

    @Column(nullable = false)
    private String program;

    @Column
    private String department;

    @Column
    private String section;

    @Column(name = "study_year", nullable = false)
    private String year;

    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL)
    private List<Timetable> timetable = new ArrayList<>();
}
