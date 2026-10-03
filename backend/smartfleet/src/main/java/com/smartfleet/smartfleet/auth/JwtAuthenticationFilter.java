package com.smartfleet.smartfleet.auth;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository) {

        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Check whether the JWT filter is running
        System.out.println("JWT FILTER CALLED");

        System.out.println(
                "Request: " +
                        request.getMethod() +
                        " " +
                        request.getRequestURI()
        );

        // 2. Read Authorization header
        String authHeader =
                request.getHeader("Authorization");

        System.out.println(
                "Authorization: " + authHeader
        );

        // 3. If there is no Bearer token,
        // continue the request
        if (authHeader == null ||
                !authHeader.startsWith("Bearer ")) {

            System.out.println("NO JWT TOKEN");

            filterChain.doFilter(request, response);
            return;
        }

        // 4. Remove "Bearer " from the header
        String token =
                authHeader.substring(7);

        System.out.println("JWT TOKEN FOUND");

        // 5. Validate JWT
        if (!jwtService.isTokenValid(token)) {

            System.out.println("JWT INVALID");

            filterChain.doFilter(request, response);
            return;
        }

        System.out.println("JWT VALID");

        // 6. Extract username from JWT
        String username =
                jwtService.extractUsername(token);

        System.out.println(
                "JWT USERNAME: " + username
        );

        // 7. Find user in database
        User user =
                userRepository.findByUsername(username)
                        .orElse(null);

        if (user != null) {

            System.out.println(
                    "USER FOUND: " + user.getUsername()
            );

            System.out.println(
                    "USER ROLE: " + user.getRole()
            );

            // 8. Convert role into Spring Security authority
            var authority =
                    new SimpleGrantedAuthority(
                            "ROLE_" +
                                    user.getRole().name()
                    );

            // 9. Create authenticated user
            var authentication =
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            null,
                            List.of(authority)
                    );

            // 10. Store authentication
            // inside Spring Security context
            SecurityContextHolder
                    .getContext()
                    .setAuthentication(authentication);

            System.out.println(
                    "AUTHENTICATION SET"
            );
        } else {

            System.out.println(
                    "USER NOT FOUND"
            );
        }

        // 11. Continue to the next filter
        filterChain.doFilter(request, response);
    }
}