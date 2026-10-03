package com.smartfleet.smartfleet.kafka;

import com.smartfleet.smartfleet.websocket.TrackingService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class DriverLocationConsumer {

    private final TrackingService trackingService;

    public DriverLocationConsumer(
            TrackingService trackingService) {

        this.trackingService = trackingService;
    }

    @KafkaListener(
            topics = "driver-location",
            groupId = "smartfleet-tracking-group"
    )
    public void consumeDriverLocation(
            DriverLocationEvent event) {
        System.out.println("Driver Location Event Received");
        System.out.println("Driver ID: " + event.getDriverId());
        System.out.println("Latitude: " + event.getLatitude());
        System.out.println("Longitude: " + event.getLongitude());
        System.out.println("Timestamp: " + event.getTimestamp());

        // Sending  Kafka event to WebSocket
        trackingService.broadcastDriverLocation(event);
    }
}