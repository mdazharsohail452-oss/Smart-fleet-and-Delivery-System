package com.smartfleet.smartfleet.vehicle;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(
            VehicleRepository vehicleRepository) {

        this.vehicleRepository = vehicleRepository;
    }

    // Creating
    public Vehicle create(Vehicle vehicle) {

        if (vehicle.getStatus() == null) {
            vehicle.setStatus("AVAILABLE");
        }

        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAll() {

        return vehicleRepository.findAll();
    }

    // Get vehicle  by id
    public Vehicle getById(Long id) {

        return vehicleRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Vehicle not found"
                        ));
    }

    // Updating vehicle details
    public Vehicle update(
            Long id,
            Vehicle updatedVehicle) {

        Vehicle vehicle = getById(id);

        vehicle.setVehicleNumber(
                updatedVehicle.getVehicleNumber()
        );

        vehicle.setVehicleType(
                updatedVehicle.getVehicleType()
        );

        vehicle.setCapacity(
                updatedVehicle.getCapacity()
        );

        vehicle.setStatus(
                updatedVehicle.getStatus()
        );

        vehicle.setDriverId(
                updatedVehicle.getDriverId()
        );

        return vehicleRepository.save(vehicle);
    }


    public void delete(Long id) {

        if (!vehicleRepository.existsById(id)) {
            throw new RuntimeException(
                    "Vehicle not found"
            );
        }

        vehicleRepository.deleteById(id);
    }
}
