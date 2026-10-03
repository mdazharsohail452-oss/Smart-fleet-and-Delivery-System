package com.smartfleet.smartfleet.websocket;

import com.smartfleet.smartfleet.kafka.DriverLocationEvent;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class TrackingService {

    private final SimpMessagingTemplate messagingTemplate;

    public TrackingService(
            SimpMessagingTemplate messagingTemplate) {

        this.messagingTemplate = messagingTemplate;
    }

    public void broadcastDriverLocation(
            DriverLocationEvent event) {

        messagingTemplate.convertAndSend(
                "/topic/driver-location",
                event
        );

        System.out.println(
                "Driver location broadcast via WebSocket"
        );
    }
}