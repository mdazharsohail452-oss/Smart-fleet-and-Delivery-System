package com.smartfleet.smartfleet.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class OrderEventProducer {

    private static final String TOPIC = "order-created";

    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public OrderEventProducer(
            KafkaTemplate<String, OrderEvent> kafkaTemplate) {

        this.kafkaTemplate = kafkaTemplate;
    }

    public void sendOrderCreatedEvent(OrderEvent event) {

        kafkaTemplate.send(
                TOPIC,
                event.getOrderId().toString(),
                event
        );

        System.out.println(
                "Kafka event sent: " + event.getOrderNumber()
        );
    }
}
