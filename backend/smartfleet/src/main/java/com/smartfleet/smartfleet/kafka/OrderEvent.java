package com.smartfleet.smartfleet.kafka;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderEvent {

    private Long orderId;

    private String orderNumber;

    private String eventType;

    private LocalDateTime timestamp;
}