package com.smartfleet.smartfleet.customer;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public customer create(
            @RequestBody customer customer) {

        return customerService.create(customer);
    }

    @GetMapping
    public List<customer> getAll() {

        return customerService.getAll();
    }

    @GetMapping("/{id}")
    public customer getById(
            @PathVariable Long id) {

        return customerService.getById(id);
    }

    @PutMapping("/{id}")
    public customer update(
            @PathVariable Long id,
            @RequestBody customer customer) {

        return customerService.update(id, customer);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        customerService.delete(id);
    }


}