package com.smartfleet.smartfleet.redis;

import com.smartfleet.smartfleet.kafka.DriverLocationEvent;
import com.smartfleet.smartfleet.kafka.DriverLocationProducer;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
public class DriverRedisService {

    private static final long TTL_SECONDS = 60;

    private final StringRedisTemplate redisTemplate;
    private final DriverLocationProducer driverLocationProducer;

    public DriverRedisService(
            StringRedisTemplate redisTemplate,
            DriverLocationProducer driverLocationProducer) {

        this.redisTemplate = redisTemplate;
        this.driverLocationProducer = driverLocationProducer;
    }

    // Saving driver location in Redis + publishing Kafka event
    public void saveDriverLocation(
            Long driverId,
            Double latitude,
            Double longitude) {

        String key = "driver:" + driverId + ":location";

        String value = latitude + "," + longitude;

        //  Saving current location in Redis
        redisTemplate.opsForValue().set(
                key,
                value,
                TTL_SECONDS,
                TimeUnit.SECONDS
        );

        //  Creating Kafka event
        DriverLocationEvent event =
                DriverLocationEvent.builder()
                        .driverId(driverId)
                        .latitude(latitude)
                        .longitude(longitude)
                        .timestamp(LocalDateTime.now())
                        .build();

        //  Sending event to Kafka
        driverLocationProducer.sendLocationEvent(event);
    }

    // Getting driver location
    public String getDriverLocation(Long driverId) {

        String key = "driver:" + driverId + ":location";

        return redisTemplate.opsForValue().get(key);
    }

    // Saving driver status
    public void saveDriverStatus(
            Long driverId,
            String status) {

        String key = "driver:" + driverId + ":status";

        redisTemplate.opsForValue().set(
                key,
                status,
                TTL_SECONDS,
                TimeUnit.SECONDS
        );
    }

    // Getting driver status
    public String getDriverStatus(Long driverId) {

        String key = "driver:" + driverId + ":status";

        return redisTemplate.opsForValue().get(key);
    }
}