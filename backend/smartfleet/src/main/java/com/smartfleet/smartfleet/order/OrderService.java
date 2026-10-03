package com.smartfleet.smartfleet.order;

import com.smartfleet.smartfleet.driver.Driver;
import com.smartfleet.smartfleet.driver.DriverRepository;
import com.smartfleet.smartfleet.driver.DriverStatus;
import com.smartfleet.smartfleet.kafka.OrderEvent;
import com.smartfleet.smartfleet.kafka.OrderEventProducer;
import com.smartfleet.smartfleet.vehicle.Vehicle;
import com.smartfleet.smartfleet.vehicle.VehicleRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderEventProducer orderEventProducer;
    private final DriverRepository driverRepository;
    private final VehicleRepository vehicleRepository;

    public OrderService(
            OrderRepository orderRepository,
            OrderEventProducer orderEventProducer,
            DriverRepository driverRepository,
            VehicleRepository vehicleRepository) {

        this.orderRepository = orderRepository;
        this.orderEventProducer = orderEventProducer;
        this.driverRepository = driverRepository;
        this.vehicleRepository = vehicleRepository;
    }
    //creating order
    public DeliveryOrder create(DeliveryOrder order) {

        order.setOrderNumber(
                "ORD-" +
                        UUID.randomUUID()
                                .toString()
                                .substring(0, 8)
                                .toUpperCase()
        );

        order.setStatus(OrderStatus.CREATED);

        order.setCreatedAt(
                LocalDateTime.now()
        );

        DeliveryOrder savedOrder =
                orderRepository.save(order);

        // Kafka event
        OrderEvent event = OrderEvent.builder()
                .orderId(savedOrder.getId())
                .orderNumber(savedOrder.getOrderNumber())
                .eventType("ORDER_CREATED")
                .timestamp(LocalDateTime.now())
                .build();

        orderEventProducer.sendOrderCreatedEvent(event);

        return savedOrder;
    }

    public List<DeliveryOrder> getAll() {

        return orderRepository.findAll();
    }
    public DeliveryOrder getById(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"
                        )
                );
    }

    public DeliveryOrder updateStatus(
            Long id,
            OrderStatus newStatus) {

        DeliveryOrder order = getById(id);

        OrderStatus currentStatus =
                order.getStatus();

        boolean validTransition =
                (currentStatus == OrderStatus.CREATED
                        && newStatus == OrderStatus.ASSIGNED)

                        || (currentStatus == OrderStatus.ASSIGNED
                        && newStatus == OrderStatus.PICKED_UP)

                        || (currentStatus == OrderStatus.PICKED_UP
                        && newStatus == OrderStatus.IN_TRANSIT)

                        || (currentStatus == OrderStatus.IN_TRANSIT
                        && newStatus == OrderStatus.DELIVERED)

                        || (newStatus == OrderStatus.CANCELLED
                        && currentStatus != OrderStatus.DELIVERED
                        && currentStatus != OrderStatus.CANCELLED);

        if (!validTransition) {

            throw new RuntimeException(
                    "Invalid order status transition: "
                            + currentStatus
                            + " -> "
                            + newStatus
            );
        }
        order.setStatus(newStatus);

        if (newStatus == OrderStatus.DELIVERED) {

            order.setDeliveredAt(
                    LocalDateTime.now()
            );


            if (order.getDriverId() != null) {

                Driver driver =
                        driverRepository.findById(
                                order.getDriverId()
                        ).orElse(null);

                if (driver != null) {

                    driver.setStatus(
                            DriverStatus.AVAILABLE
                    );

                    driverRepository.save(driver);
                }
            }

            if (order.getVehicleId() != null) {

                Vehicle vehicle =
                        vehicleRepository.findById(
                                order.getVehicleId()
                        ).orElse(null);

                if (vehicle != null) {

                    vehicle.setStatus(
                            "AVAILABLE"
                    );

                    vehicle.setDriverId(null);

                    vehicleRepository.save(vehicle);
                }
            }
        }

        return orderRepository.save(order);
    }

    public DeliveryOrder assignDriverAndVehicle(
            Long orderId,
            Long driverId,
            Long vehicleId) {

        // Getting order
        DeliveryOrder order =
                getById(orderId);

        // Getting driver
        Driver driver =
                driverRepository.findById(driverId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Driver not found"
                                )
                        );

        // Getting vehicle
        Vehicle vehicle =
                vehicleRepository.findById(vehicleId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Vehicle not found"
                                )
                        );
        //validation is it available
        if (driver.getStatus() != DriverStatus.AVAILABLE) {
            throw new RuntimeException(
                    "Driver is not available"
            );
        }

        if (!"AVAILABLE".equals(vehicle.getStatus())) {
            throw new RuntimeException(
                    "Vehicle is not available"
            );
        }

        if (vehicle.getDriverId() != null) {
            throw new RuntimeException(
                    "Vehicle is already assigned to a driver"
            );
        }
        order.setDriverId(
                driver.getId()
        );
        order.setVehicleId(
                vehicle.getId()
        );


//updating driver status
        driver.setStatus(
                DriverStatus.ON_DELIVERY
        );

        vehicle.setStatus(
                "IN_USE"
        );

        vehicle.setDriverId(
                driver.getId()
        );

        order.setStatus(
                OrderStatus.ASSIGNED
        );

        driverRepository.save(driver);
        vehicleRepository.save(vehicle);
        return orderRepository.save(order);
    }
}