package com.smartfleet.smartfleet.driver;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(
            DriverService driverService) {

        this.driverService = driverService;
    }

    // CREATE
    @PostMapping
    public Driver create(
            @RequestBody Driver driver) {

        return driverService.create(driver);
    }

    // GET ALL
    @GetMapping
    public List<Driver> getAll() {

        return driverService.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Driver getById(
            @PathVariable Long id) {

        return driverService.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Driver update(
            @PathVariable Long id,
            @RequestBody Driver driver) {

        return driverService.update(
                id,
                driver
        );
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id) {

        driverService.delete(id);
    }
}