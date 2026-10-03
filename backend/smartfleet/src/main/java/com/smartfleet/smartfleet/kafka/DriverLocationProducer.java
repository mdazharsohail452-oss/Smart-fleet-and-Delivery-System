package com.smartfleet.smartfleet.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class DriverLocationProducer {

    private static final String TOPIC = "driver-location";

    private final KafkaTemplate<String, DriverLocationEvent> kafkaTemplate;

    public DriverLocationProducer(
            KafkaTemplate<String, DriverLocationEvent> kafkaTemplate) {

        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendLocationEvent(DriverLocationEvent event) {

        kafkaTemplate.send(
                TOPIC,
                event.getDriverId().toString(),
                event
        );

        System.out.println(
                "Driver location event sent for driver: "
                        + event.getDriverId()
        );
    }
}