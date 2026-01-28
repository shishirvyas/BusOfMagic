package com.magicbus.service;

import com.magicbus.dto.CustomerDTO;
import com.magicbus.entity.Customer;
import com.magicbus.repository.CustomerRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll()
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public CustomerDTO getCustomerById(Long id) {
        return customerRepository.findById(id)
            .map(this::convertToDTO)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
    }

    public CustomerDTO createCustomer(CustomerDTO dto) {
        if (customerRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        Customer customer = convertToEntity(dto);
        return convertToDTO(customerRepository.save(customer));
    }

    public CustomerDTO updateCustomer(Long id, CustomerDTO dto) {
        Customer customer = customerRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        customer.setName(dto.getName());
        customer.setEmail(dto.getEmail());
        customer.setStatus(dto.getStatus());
        customer.setPurchaseCount(dto.getPurchaseCount());
        customer.setTotalSpent(dto.getTotalSpent());
        
        return convertToDTO(customerRepository.save(customer));
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

    public List<CustomerDTO> getCustomersByStatus(String status) {
        return customerRepository.findByStatus(status)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private CustomerDTO convertToDTO(Customer customer) {
        return CustomerDTO.builder()
            .id(customer.getId())
            .name(customer.getName())
            .email(customer.getEmail())
            .status(customer.getStatus())
            .purchaseCount(customer.getPurchaseCount())
            .totalSpent(customer.getTotalSpent())
            .build();
    }

    private Customer convertToEntity(CustomerDTO dto) {
        return Customer.builder()
            .name(dto.getName())
            .email(dto.getEmail())
            .status(dto.getStatus())
            .purchaseCount(dto.getPurchaseCount())
            .totalSpent(dto.getTotalSpent())
            .build();
    }
}
