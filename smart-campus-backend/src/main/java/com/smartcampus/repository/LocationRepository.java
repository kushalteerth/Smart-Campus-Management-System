package com.smartcampus.repository;

import com.smartcampus.model.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LocationRepository extends JpaRepository<Location, Long> {
    Optional<Location> findByLocationId(String locationId);
    boolean existsByLocationId(String locationId);

    @Query("SELECT l FROM Location l WHERE LOWER(l.name) LIKE LOWER(CONCAT('%', :name, '%')) OR LOWER(l.description) LIKE LOWER(CONCAT('%', :desc, '%'))")
    Page<Location> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(
            @Param("name") String name, @Param("desc") String desc, Pageable pageable);
}
