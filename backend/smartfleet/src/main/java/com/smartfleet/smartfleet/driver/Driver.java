package com.smartfleet.smartfleet.driver;



import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "drivers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonPropertyOrder({
        "id",
        "name",
        "phone",
        "licenseNumber",
        "status",
        "latitude",
        "longitude"
})
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String phone;

    @Column(unique = true, nullable = false)
    private String licenseNumber;

    @Enumerated(EnumType.STRING)
    private DriverStatus status;

    private Double latitude;

    private Double longitude;
}