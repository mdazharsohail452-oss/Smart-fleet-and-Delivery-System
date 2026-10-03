package com.smartfleet.smartfleet.auth;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner createUsers(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        return args -> {

            // Create ADMIN
            if (userRepository
                    .findByUsername("admin")
                    .isEmpty()) {

                User admin = User.builder()
                        .username("admin")
                        .password(
                                passwordEncoder.encode(
                                        "Admin@12345"
                                )
                        )
                        .role(Role.ADMIN)
                        .build();

                userRepository.save(admin);

                System.out.println("Admin user created");
            }

            // Create DISPATCHER
            if (userRepository
                    .findByUsername("dispatcher")
                    .isEmpty()) {

                User dispatcher = User.builder()
                        .username("dispatcher")
                        .password(
                                passwordEncoder.encode(
                                        "Dispacther@123"
                                )
                        )
                        .role(Role.DISPATCHER)
                        .build();

                userRepository.save(dispatcher);

                System.out.println(
                        "Dispatcher user created"
                );
            }
        };
    }
}