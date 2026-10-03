package com.smartfleet.smartfleet.order;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public DeliveryOrder create(@RequestBody DeliveryOrder order) {
        return orderService.create(order);
    }

    @GetMapping
    public List<DeliveryOrder> getAll() {
        return orderService.getAll();
    }
    @GetMapping("/{id}")
    public DeliveryOrder getById(@PathVariable Long id) {
        return orderService.getById(id);
    }

    @PutMapping("/{id}/status")
    public DeliveryOrder updateStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {

        return orderService.updateStatus(id, status);
    }
    @PutMapping("/{id}/assign")
    public DeliveryOrder assignDriverAndVehicle(
            @PathVariable Long id,
            @RequestParam Long driverId,
            @RequestParam Long vehicleId) {

        return orderService.assignDriverAndVehicle(
                id,
                driverId,
                vehicleId
        );
    }
}
