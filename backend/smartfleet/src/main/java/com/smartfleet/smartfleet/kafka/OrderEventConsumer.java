package com.smartfleet.smartfleet.kafka;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class OrderEventConsumer {

    @KafkaListener(
            topics = "order-created",
            groupId = "smartfleet-order-group"
    )
    public void consumeOrderCreatedEvent(OrderEvent event) {

        System.out.println("==========");
        System.out.println("Kafka Event Received");
        System.out.println("Order ID: " + event.getOrderId());
        System.out.println("Order Number: " + event.getOrderNumber());
        System.out.println("Event Type: " + event.getEventType());
        System.out.println("Timestamp: " + event.getTimestamp());
        System.out.println("=================================");
    }
}
