package com.smartfleet.smartfleet.vehicle;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleRepository
        extends JpaRepository<Vehicle, Long> {
}