package com.smartfleet.smartfleet.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic orderCreatedTopic() {
        return new NewTopic(
                "order-created",
                1,
                (short) 1
        );
    }
    @Bean
    public NewTopic driverLocationTopic() {
        return new NewTopic(
                "driver-location",
                1,
                (short) 1
        );
    }
}