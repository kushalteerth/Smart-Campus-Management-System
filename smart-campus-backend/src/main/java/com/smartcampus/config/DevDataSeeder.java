package com.smartcampus.config;

import com.smartcampus.dsa.RouteEngine;
import com.smartcampus.model.*;
import com.smartcampus.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@Configuration
@Profile("dev")
public class DevDataSeeder {

    @Bean
    CommandLineRunner seedData(
            UserRepository userRepository,
            StudentRepository studentRepository,
            LocationRepository locationRepository,
            RouteRepository routeRepository,
            TimetableRepository timetableRepository,
            DepartmentRepository departmentRepository,
            FacilityRepository facilityRepository,
            OperationsRepository operationsRepository,
            RouteEngine routeEngine,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // 1. Seed Admin
            if (!userRepository.existsByUsername("admin")) {
                Admin admin = new Admin();
                admin.setUserId("ADMIN001");
                admin.setFullName("System Administrator");
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("password"));
                admin.setRole(Role.ADMIN);
                admin.setDepartment("IT Administration");
                admin.setEmail("admin@smartcampus.edu");
                userRepository.save(admin);
                System.out.println("✅ Default admin created: username=admin, password=password");
            }

            // 2. Seed Student
            Student student = null;
            if (!userRepository.existsByUsername("student")) {
                student = new Student();
                student.setUserId("S_CS202401");
                student.setStudentId("CS202401");
                student.setFullName("Alex Rivers");
                student.setUsername("student");
                student.setPassword(passwordEncoder.encode("password"));
                student.setRole(Role.STUDENT);
                student.setProgram("B.Tech Computer Science");
                student.setDepartment("Computer Science");
                student.setYear("3");
                student.setSection("A");
                student = studentRepository.save(student);
                System.out.println("✅ Default student created: username=student, password=password, studentId=CS202401");
            } else {
                student = studentRepository.findByStudentId("CS202401").orElse(null);
            }

            // 3. Seed Campus Locations
            Map<String, Location> locMap = new HashMap<>();
            if (locationRepository.count() == 0) {
                locMap.put("LOC_MAIN_GATE", createLocation(locationRepository, "LOC_MAIN_GATE", "Main Campus Gate", "Gate Complex", "Ground", "Primary campus entrance and 24/7 security checkpoint", 0.0));
                locMap.put("LOC_ADMIN", createLocation(locationRepository, "LOC_ADMIN", "Administration Block", "Admin Tower", "1st Floor", "Offices of Director, Registrar and Student Affairs", 120.0));
                locMap.put("LOC_LIBRARY", createLocation(locationRepository, "LOC_LIBRARY", "Central Library", "Knowledge Hub", "Ground & 1st", "Comprehensive books, research journals and digital library", 250.0));
                locMap.put("LOC_CS", createLocation(locationRepository, "LOC_CS", "Computer Science & Engineering", "Tech Wing A", "2nd Floor", "CS classrooms, advanced software labs and faculty cabins", 300.0));
                locMap.put("LOC_EC", createLocation(locationRepository, "LOC_EC", "Electronics & Communication", "Tech Wing B", "1st Floor", "VLSI labs, embedded systems labs and classrooms", 380.0));
                locMap.put("LOC_CAFETERIA", createLocation(locationRepository, "LOC_CAFETERIA", "Campus Cafeteria & Food Court", "Student Center", "Ground", "Multi-cuisine dining hall, snack counters and coffee shops", 280.0));
                locMap.put("LOC_SPORTS", createLocation(locationRepository, "LOC_SPORTS", "Indoor Sports Complex & Gym", "Sports Pavilion", "Ground", "Gymnasium, badminton courts, table tennis and fitness hub", 450.0));
                locMap.put("LOC_AUDITORIUM", createLocation(locationRepository, "LOC_AUDITORIUM", "Main University Auditorium", "Convention Center", "Ground", "800-seat multipurpose auditorium for events, seminars and festivals", 320.0));
                locMap.put("LOC_HOSTEL_A", createLocation(locationRepository, "LOC_HOSTEL_A", "Boys Hostel (Block A)", "Hostel Zone", "Floors 1-4", "Residential quarters for male undergraduate students", 500.0));
                locMap.put("LOC_HOSTEL_B", createLocation(locationRepository, "LOC_HOSTEL_B", "Girls Hostel (Block B)", "Hostel Zone", "Floors 1-4", "Residential quarters for female undergraduate students", 520.0));
                locMap.put("LOC_HEALTH", createLocation(locationRepository, "LOC_HEALTH", "Campus Health & Medical Center", "Health Clinic", "Ground", "First aid, emergency care, medical officers on duty", 180.0));
                System.out.println("✅ Seeded 11 campus locations");
            } else {
                locationRepository.findAll().forEach(l -> locMap.put(l.getLocationId(), l));
            }

            // 4. Seed Campus Routes
            if (routeRepository.count() == 0 && locMap.size() >= 11) {
                createRoute(routeRepository, "R_01", locMap.get("LOC_MAIN_GATE"), locMap.get("LOC_ADMIN"), 120.0, "Main avenue pathway");
                createRoute(routeRepository, "R_02", locMap.get("LOC_MAIN_GATE"), locMap.get("LOC_LIBRARY"), 250.0, "Central boulevard path");
                createRoute(routeRepository, "R_03", locMap.get("LOC_MAIN_GATE"), locMap.get("LOC_HEALTH"), 180.0, "Direct emergency pathway");
                createRoute(routeRepository, "R_04", locMap.get("LOC_ADMIN"), locMap.get("LOC_LIBRARY"), 140.0, "Academic garden walkway");
                createRoute(routeRepository, "R_05", locMap.get("LOC_ADMIN"), locMap.get("LOC_CS"), 220.0, "Covered corridor to Tech Wing");
                createRoute(routeRepository, "R_06", locMap.get("LOC_CS"), locMap.get("LOC_EC"), 90.0, "Connecting skybridge between Tech wings");
                createRoute(routeRepository, "R_07", locMap.get("LOC_CS"), locMap.get("LOC_CAFETERIA"), 180.0, "Plaza pathway to dining");
                createRoute(routeRepository, "R_08", locMap.get("LOC_LIBRARY"), locMap.get("LOC_CAFETERIA"), 150.0, "Library promenade");
                createRoute(routeRepository, "R_09", locMap.get("LOC_CAFETERIA"), locMap.get("LOC_SPORTS"), 200.0, "Sports promenade pathway");
                createRoute(routeRepository, "R_10", locMap.get("LOC_EC"), locMap.get("LOC_SPORTS"), 260.0, "East campus walkway");
                createRoute(routeRepository, "R_11", locMap.get("LOC_CAFETERIA"), locMap.get("LOC_AUDITORIUM"), 190.0, "Convention center plaza");
                createRoute(routeRepository, "R_12", locMap.get("LOC_AUDITORIUM"), locMap.get("LOC_HEALTH"), 160.0, "South perimeter pathway");
                createRoute(routeRepository, "R_13", locMap.get("LOC_SPORTS"), locMap.get("LOC_HOSTEL_A"), 220.0, "Hostel ring road west");
                createRoute(routeRepository, "R_14", locMap.get("LOC_SPORTS"), locMap.get("LOC_HOSTEL_B"), 240.0, "Hostel ring road east");
                createRoute(routeRepository, "R_15", locMap.get("LOC_HOSTEL_A"), locMap.get("LOC_HOSTEL_B"), 110.0, "Hostel quadrangle walkway");
                System.out.println("✅ Seeded 15 campus routes");
            }

            // 5. Seed Timetable for Student
            if (student != null && timetableRepository.findByStudentId(student.getId()).isEmpty()) {
                createTimetable(timetableRepository, student, "Data Structures & Algorithms", "MONDAY", LocalTime.of(9, 0), LocalTime.of(10, 30), "Dr. Alan Turing", locMap.get("LOC_CS"));
                createTimetable(timetableRepository, student, "Database Systems", "MONDAY", LocalTime.of(11, 0), LocalTime.of(12, 30), "Dr. Edgar Codd", locMap.get("LOC_CS"));
                createTimetable(timetableRepository, student, "Computer Networks", "TUESDAY", LocalTime.of(10, 0), LocalTime.of(11, 30), "Prof. Claude Shannon", locMap.get("LOC_EC"));
                createTimetable(timetableRepository, student, "Software Engineering Lab", "WEDNESDAY", LocalTime.of(14, 0), LocalTime.of(16, 0), "Dr. Margaret Hamilton", locMap.get("LOC_CS"));
                createTimetable(timetableRepository, student, "Artificial Intelligence", "THURSDAY", LocalTime.of(9, 0), LocalTime.of(10, 30), "Prof. Marvin Minsky", locMap.get("LOC_CS"));
                createTimetable(timetableRepository, student, "Operating Systems", "FRIDAY", LocalTime.of(11, 0), LocalTime.of(12, 30), "Dr. Ken Thompson", locMap.get("LOC_CS"));
                System.out.println("✅ Seeded student timetable entries");
            }

            // 6. Seed Departments
            if (departmentRepository.count() == 0 && locMap.containsKey("LOC_CS")) {
                Department depCs = new Department();
                depCs.setDepartmentId("DEP_CS");
                depCs.setName("Computer Science & Engineering");
                depCs.setDescription("Undergraduate and Postgraduate programs in computing, software and intelligent systems.");
                depCs.setHeadOfDept("Dr. Alan Turing");
                depCs.setFacilities("HPC Lab, AI Robotics Lab, Cloud Computing Suite");
                depCs.setPurpose("Excellence in computing education and cutting-edge software research.");
                depCs.setTiming("08:30 AM - 05:30 PM");
                depCs.setLocation(locMap.get("LOC_CS"));
                departmentRepository.save(depCs);

                Department depEc = new Department();
                depEc.setDepartmentId("DEP_EC");
                depEc.setName("Electronics & Communication Engineering");
                depEc.setDescription("Hardware, communications, signal processing and embedded system design.");
                depEc.setHeadOfDept("Prof. Claude Shannon");
                depEc.setFacilities("VLSI Design Lab, DSP Lab, Microwave Center");
                depEc.setPurpose("Pioneering wireless networks and hardware system architectures.");
                depEc.setTiming("08:30 AM - 05:30 PM");
                depEc.setLocation(locMap.get("LOC_EC"));
                departmentRepository.save(depEc);
                System.out.println("✅ Seeded academic departments");
            }

            // 7. Seed Facilities
            if (facilityRepository.count() == 0 && locMap.containsKey("LOC_CS")) {
                Facility fac1 = new Facility();
                fac1.setFacilityId("FAC_CS_LAB1");
                fac1.setName("Advanced AI & Machine Learning Lab");
                fac1.setDescription("Equipped with high-end GPU workstations and robotics kits.");
                fac1.setFacilityType("Computer Lab");
                fac1.setLocation(locMap.get("LOC_CS"));
                fac1.setAvailable(true);
                facilityRepository.save(fac1);

                Facility fac2 = new Facility();
                fac2.setFacilityId("FAC_LIB_READ");
                fac2.setName("Central Library Quiet Reading Pavilion");
                fac2.setDescription("Quiet study cubicles with power sockets and high-speed Wi-Fi.");
                fac2.setFacilityType("Study Area");
                fac2.setLocation(locMap.get("LOC_LIBRARY"));
                fac2.setAvailable(true);
                facilityRepository.save(fac2);

                Facility fac3 = new Facility();
                fac3.setFacilityId("FAC_GYM");
                fac3.setName("Campus Fitness Center & Gymnasium");
                fac3.setDescription("Cardio and strength training equipment with certified trainers.");
                fac3.setFacilityType("Sports");
                fac3.setLocation(locMap.get("LOC_SPORTS"));
                fac3.setAvailable(true);
                facilityRepository.save(fac3);
                System.out.println("✅ Seeded campus facilities");
            }

            // 8. Seed Operations
            if (operationsRepository.count() == 0 && locMap.containsKey("LOC_LIBRARY")) {
                Operations op1 = new Operations();
                op1.setOperationId("OP_LIB_CIRC");
                op1.setName("Library Circulation & Helpdesk");
                op1.setDescription("Book issue, renewals, research guidance and repository access.");
                op1.setStatus("ACTIVE");
                op1.setLocation(locMap.get("LOC_LIBRARY"));
                op1.setOperatingHours("08:00 AM - 08:00 PM");
                operationsRepository.save(op1);

                Operations op2 = new Operations();
                op2.setOperationId("OP_FEE_DESK");
                op2.setName("Student Accounts & Fee Payment Desk");
                op2.setDescription("Tuition payment, scholarship disbursements and financial clearance.");
                op2.setStatus("ACTIVE");
                op2.setLocation(locMap.get("LOC_ADMIN"));
                op2.setOperatingHours("09:30 AM - 04:30 PM");
                operationsRepository.save(op2);

                Operations op3 = new Operations();
                op3.setOperationId("OP_SECURITY");
                op3.setName("Main Gate Security Post");
                op3.setDescription("Visitor registration, parking permits and security surveillance.");
                op3.setStatus("ACTIVE");
                op3.setLocation(locMap.get("LOC_MAIN_GATE"));
                op3.setOperatingHours("24 Hours / 7 Days");
                operationsRepository.save(op3);
                System.out.println("✅ Seeded campus operations");
            }

            // 9. Rebuild and refresh graph in RouteEngine
            routeEngine.refreshGraph();
            System.out.println("✅ Campus RouteEngine graph initialized with all locations and routes!");
        };
    }

    private Location createLocation(LocationRepository repo, String id, String name, String building, String floor, String desc, double dist) {
        Location loc = new Location();
        loc.setLocationId(id);
        loc.setName(name);
        loc.setBuilding(building);
        loc.setFloor(floor);
        loc.setDescription(desc);
        loc.setDistance(dist);
        loc.setStatus("OPEN");
        loc.setOpeningTime(LocalTime.of(8, 0));
        loc.setClosingTime(LocalTime.of(21, 0));
        return repo.save(loc);
    }

    private void createRoute(RouteRepository repo, String id, Location src, Location dst, double distance, String desc) {
        Route route = new Route();
        route.setRouteId(id);
        route.setSourceLocation(src);
        route.setDestinationLocation(dst);
        route.setDistance(distance);
        route.setBidirectional(true);
        route.setDescription(desc);
        repo.save(route);
    }

    private void createTimetable(TimetableRepository repo, Student student, String subject, String day, LocalTime start, LocalTime end, String instructor, Location location) {
        Timetable tt = new Timetable();
        tt.setStudent(student);
        tt.setSubject(subject);
        tt.setDayOfWeek(day);
        tt.setStartTime(start);
        tt.setEndTime(end);
        tt.setInstructor(instructor);
        tt.setLocation(location);
        repo.save(tt);
    }
}
