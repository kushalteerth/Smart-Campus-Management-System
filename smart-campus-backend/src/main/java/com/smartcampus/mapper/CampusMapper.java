package com.smartcampus.mapper;

import com.smartcampus.dto.campus.CampusDTOs.*;
import com.smartcampus.model.*;
import org.springframework.stereotype.Component;

@Component
public class CampusMapper {

    public LocationDTO toLocationDTO(Location location) {
        if (location == null) return null;
        LocationDTO dto = new LocationDTO();
        dto.setLocationId(location.getLocationId());
        dto.setName(location.getName());
        dto.setDescription(location.getDescription());
        dto.setBuilding(location.getBuilding());
        dto.setFloor(location.getFloor());
        dto.setDepartment(location.getDepartment());
        dto.setDistance(location.getDistance());
        dto.setStatus(location.getStatus());
        dto.setOpeningTime(location.getOpeningTime());
        dto.setClosingTime(location.getClosingTime());
        return dto;
    }

    public Location toEntity(CreateLocationRequest req) {
        Location loc = new Location();
        loc.setLocationId(req.getLocationId());
        loc.setName(req.getName());
        loc.setDescription(req.getDescription());
        loc.setBuilding(req.getBuilding());
        loc.setFloor(req.getFloor());
        loc.setDepartment(req.getDepartment());
        loc.setDistance(req.getDistance());
        if (req.getStatus() != null) loc.setStatus(req.getStatus());
        loc.setOpeningTime(req.getOpeningTime());
        loc.setClosingTime(req.getClosingTime());
        return loc;
    }

    public void updateEntity(Location loc, CreateLocationRequest req) {
        loc.setName(req.getName());
        loc.setDescription(req.getDescription());
        loc.setBuilding(req.getBuilding());
        loc.setFloor(req.getFloor());
        loc.setDepartment(req.getDepartment());
        loc.setDistance(req.getDistance());
        if (req.getStatus() != null) loc.setStatus(req.getStatus());
        loc.setOpeningTime(req.getOpeningTime());
        loc.setClosingTime(req.getClosingTime());
    }

    public DepartmentDTO toDepartmentDTO(Department dept) {
        if (dept == null) return null;
        DepartmentDTO dto = new DepartmentDTO();
        dto.setDepartmentId(dept.getDepartmentId());
        dto.setName(dept.getName());
        dto.setDescription(dept.getDescription());
        dto.setHeadOfDept(dept.getHeadOfDept());
        dto.setFacilities(dept.getFacilities());
        dto.setPurpose(dept.getPurpose());
        dto.setTiming(dept.getTiming());
        if (dept.getLocation() != null) {
            dto.setLocationId(dept.getLocation().getLocationId());
            dto.setLocationName(dept.getLocation().getName());
        }
        return dto;
    }

    public FacilityDTO toFacilityDTO(Facility fac) {
        if (fac == null) return null;
        FacilityDTO dto = new FacilityDTO();
        dto.setFacilityId(fac.getFacilityId());
        dto.setName(fac.getName());
        dto.setDescription(fac.getDescription());
        dto.setFacilityType(fac.getFacilityType());
        dto.setAvailable(fac.isAvailable());
        if (fac.getLocation() != null) {
            dto.setLocationId(fac.getLocation().getLocationId());
            dto.setLocationName(fac.getLocation().getName());
        }
        return dto;
    }

    public RouteDTO toRouteDTO(Route route) {
        if (route == null) return null;
        RouteDTO dto = new RouteDTO();
        dto.setRouteId(route.getRouteId());
        if (route.getSourceLocation() != null) {
            dto.setSourceLocationId(route.getSourceLocation().getLocationId());
            dto.setSourceLocationName(route.getSourceLocation().getName());
        }
        if (route.getDestinationLocation() != null) {
            dto.setDestinationLocationId(route.getDestinationLocation().getLocationId());
            dto.setDestinationLocationName(route.getDestinationLocation().getName());
        }
        dto.setDistance(route.getDistance());
        dto.setDescription(route.getDescription());
        dto.setBidirectional(route.isBidirectional());
        return dto;
    }

    public Route toEntity(CreateRouteRequest req, Location source, Location dest) {
        Route route = new Route();
        route.setRouteId(req.getRouteId());
        route.setSourceLocation(source);
        route.setDestinationLocation(dest);
        route.setDistance(req.getDistance());
        route.setDescription(req.getDescription());
        route.setBidirectional(req.isBidirectional());
        return route;
    }

    public void updateEntity(Route route, CreateRouteRequest req, Location source, Location dest) {
        route.setSourceLocation(source);
        route.setDestinationLocation(dest);
        route.setDistance(req.getDistance());
        route.setDescription(req.getDescription());
        route.setBidirectional(req.isBidirectional());
    }

    public OperationsDTO toOperationsDTO(Operations op) {
        if (op == null) return null;
        OperationsDTO dto = new OperationsDTO();
        dto.setOperationId(op.getOperationId());
        dto.setName(op.getName());
        dto.setDescription(op.getDescription());
        dto.setStatus(op.getStatus());
        dto.setOperatingHours(op.getOperatingHours());
        if (op.getLocation() != null) {
            dto.setLocationId(op.getLocation().getLocationId());
            dto.setLocationName(op.getLocation().getName());
        }
        return dto;
    }

    public TimetableDTO toTimetableDTO(Timetable tt) {
        if (tt == null) return null;
        TimetableDTO dto = new TimetableDTO();
        dto.setId(tt.getId());
        if (tt.getStudent() != null) {
            dto.setStudentId(tt.getStudent().getStudentId());
        }
        dto.setSubject(tt.getSubject());
        dto.setDayOfWeek(tt.getDayOfWeek());
        dto.setStartTime(tt.getStartTime());
        dto.setEndTime(tt.getEndTime());
        dto.setInstructor(tt.getInstructor());
        if (tt.getLocation() != null) {
            dto.setLocationId(tt.getLocation().getLocationId());
            dto.setLocationName(tt.getLocation().getName());
        }
        return dto;
    }
}
