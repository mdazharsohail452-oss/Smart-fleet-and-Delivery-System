package com.smartfleet.smartfleet.vehicle;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(
            VehicleService vehicleService) {

        this.vehicleService = vehicleService;
    }

    @PostMapping
    public Vehicle create(
            @RequestBody Vehicle vehicle) {

        return vehicleService.create(vehicle);
    }

    @GetMapping
    public List<Vehicle> getAll() {

        return vehicleService.getAll();
    }

    @GetMapping("/{id}")
    public Vehicle getById(
            @PathVariable Long id) {

        return vehicleService.getById(id);
    }

    @PutMapping("/{id}")
    public Vehicle update(
            @PathVariable Long id,
            @RequestBody Vehicle vehicle) {

        return vehicleService.update(
                id,
                vehicle
        );
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id) {

        vehicleService.delete(id);
    }
}