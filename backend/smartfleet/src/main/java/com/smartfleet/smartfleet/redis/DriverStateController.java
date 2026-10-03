package com.smartfleet.smartfleet.redis;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/driver-state")
public class DriverStateController {

    private final DriverRedisService driverRedisService;

    public DriverStateController(
            DriverRedisService driverRedisService) {

        this.driverRedisService = driverRedisService;
    }

    @PutMapping("/{driverId}/location")
    public String updateLocation(
            @PathVariable Long driverId,
            @RequestParam Double latitude,
            @RequestParam Double longitude) {

        driverRedisService.saveDriverLocation(
                driverId,
                latitude,
                longitude
        );

        return "Driver location updated";
    }

    @GetMapping("/{driverId}/location")
    public String getLocation(
            @PathVariable Long driverId) {

        return driverRedisService.getDriverLocation(driverId);
    }

    @PutMapping("/{driverId}/status")
    public String updateStatus(
            @PathVariable Long driverId,
            @RequestParam String status) {

        driverRedisService.saveDriverStatus(
                driverId,
                status
        );

        return "Driver status updated";
    }

    @GetMapping("/{driverId}/status")
    public String getStatus(
            @PathVariable Long driverId) {

        return driverRedisService.getDriverStatus(driverId);
    }
}