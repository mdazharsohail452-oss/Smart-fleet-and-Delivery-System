package com.smartfleet.smartfleet.config;

import com.smartfleet.smartfleet.auth.JwtAuthenticationFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .cors(cors -> {})

                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth


                        // LOGIN

                        .requestMatchers("/auth/**")
                        .permitAll()

                        // CUSTOMERS
                        .requestMatchers(
                                HttpMethod.GET,
                                "/customers/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DISPATCHER"
                        )

                        .requestMatchers("/customers/**")
                        .hasRole("ADMIN")


                        // =========================
                        // Drivers

                        .requestMatchers(
                                HttpMethod.GET,
                                "/drivers/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DISPATCHER"
                        )

                        .requestMatchers("/drivers/**")
                        .hasRole("ADMIN")

                        // Vehicles

                        .requestMatchers(
                                HttpMethod.GET,
                                "/vehicles/**"
                        )
                        .hasAnyRole(
                                "ADMIN",
                                "DISPATCHER"
                        )

                        .requestMatchers("/vehicles/**")
                        .hasRole("ADMIN")

                        // Orders

                        .requestMatchers("/orders/**")
                        .hasAnyRole(
                                "ADMIN",
                                "DISPATCHER"
                        )


                        // LIVE Driver state

                        .requestMatchers("/driver-state/**")
                        .hasAnyRole(
                                "ADMIN",
                                "DISPATCHER"
                        )


                        // EVERYTHING ELSE


                        .anyRequest()
                        .authenticated()
                )

                // Put our JWT filter into
                // Spring Security's filter chain
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // CORS

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        configuration.setAllowedOrigins(
                List.of("http://localhost:5173")
        );

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(
                List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );

        return source;
    }


    // PASSWORD ENCODER

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }
}