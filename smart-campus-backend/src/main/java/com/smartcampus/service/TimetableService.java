package com.smartcampus.service;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.exception.Exceptions.*;
import com.smartcampus.mapper.CampusMapper;
import com.smartcampus.model.Location;
import com.smartcampus.model.Student;
import com.smartcampus.model.Timetable;
import com.smartcampus.repository.LocationRepository;
import com.smartcampus.repository.StudentRepository;
import com.smartcampus.repository.TimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class TimetableService {

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private CampusMapper mapper;

    public TimetableDTO createTimetable(CreateTimetableRequest req) {
        if (req.getStartTime().isAfter(req.getEndTime()) || req.getStartTime().equals(req.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        Student student = studentRepository.findByStudentId(req.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + req.getStudentId()));

        Timetable tt = new Timetable();
        tt.setStudent(student);
        tt.setSubject(req.getSubject());
        tt.setDayOfWeek(req.getDayOfWeek().toUpperCase());
        tt.setStartTime(req.getStartTime());
        tt.setEndTime(req.getEndTime());
        tt.setInstructor(req.getInstructor());

        if (req.getLocationId() != null && !req.getLocationId().isEmpty()) {
            Location loc = locationRepository.findByLocationId(req.getLocationId())
                    .orElseThrow(() -> new ResourceNotFoundException("Location not found: " + req.getLocationId()));
            tt.setLocation(loc);
        }

        return mapper.toTimetableDTO(timetableRepository.save(tt));
    }

    public List<TimetableDTO> getTimetableByStudentId(String studentId) {
        Student student = studentRepository.findByStudentId(studentId)
                .or(() -> studentRepository.findByUserId(studentId))
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        return timetableRepository.findByStudentId(student.getId()).stream()
                .map(mapper::toTimetableDTO)
                .collect(Collectors.toList());
    }

    public void deleteTimetable(Long id) {
        if (!timetableRepository.existsById(id)) {
            throw new ResourceNotFoundException("Timetable entry not found with id: " + id);
        }
        timetableRepository.deleteById(id);
    }
}
