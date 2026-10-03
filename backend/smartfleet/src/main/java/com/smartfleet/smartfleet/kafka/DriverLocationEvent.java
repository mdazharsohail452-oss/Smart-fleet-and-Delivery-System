package com.smartfleet.smartfleet.kafka;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverLocationEvent {

    private Long driverId;

    private Double latitude;

    private Double longitude;

    private LocalDateTime timestamp;
}