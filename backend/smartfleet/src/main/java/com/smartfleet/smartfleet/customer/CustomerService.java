package com.smartfleet.smartfleet.customer;

import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class CustomerService {
    private final CustomerRepository  customerRepository;
  public  CustomerService(CustomerRepository customerRepository) {
    this.customerRepository = customerRepository;
  }
  public customer create(customer Customer){
      return customerRepository.save(Customer);
  }

    public List<customer> getAll(){
      return customerRepository.findAll();
    }

    public customer getById(Long id){
      return customerRepository.findById(id).orElseThrow(() ->
              new RuntimeException("customer not found"));
    }
    public customer update(Long id, customer updatedCustomer) {

        customer Customer = getById(id);

        Customer.setName(updatedCustomer.getName());
        Customer.setEmail(updatedCustomer.getEmail());
        Customer.setPhone(updatedCustomer.getPhone());
        Customer.setAddress(updatedCustomer.getAddress());

        return customerRepository.save(Customer);
    }
    public void delete(Long id) {

        if (!customerRepository.existsById(id)) {
            throw new RuntimeException("Customer not found");
        }

        customerRepository.deleteById(id);
    }

}
