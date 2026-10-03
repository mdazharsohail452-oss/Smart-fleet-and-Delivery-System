package com.smartfleet.smartfleet.driver;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DriverService {

    private final DriverRepository driverRepository;

    public DriverService(DriverRepository driverRepository) {
        this.driverRepository = driverRepository;
    }

    // Creating driver
    public Driver create(Driver driver) {

        if (driver.getStatus() == null) {
            driver.setStatus(DriverStatus.OFFLINE);
        }

        return driverRepository.save(driver);
    }

    public List<Driver> getAll() {

        return driverRepository.findAll();
    }

    public Driver getById(Long id) {

        return driverRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Driver not found"));
    }

    public Driver update(Long id, Driver updatedDriver) {

        Driver driver = getById(id);

        driver.setName(updatedDriver.getName());
        driver.setPhone(updatedDriver.getPhone());
        driver.setLicenseNumber(
                updatedDriver.getLicenseNumber()
        );

        driver.setStatus(updatedDriver.getStatus());

        return driverRepository.save(driver);
    }


    public void delete(Long id) {

        if (!driverRepository.existsById(id)) {
            throw new RuntimeException("Driver not found");
        }

        driverRepository.deleteById(id);
    }
    public Driver updateStatus(Long id, DriverStatus status) {

        Driver driver = driverRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Driver not found"));

        driver.setStatus(status);

        return driverRepository.save(driver);
    }
}