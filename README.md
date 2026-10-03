# SmartFleet — Real-Time Fleet & Delivery Management System

SmartFleet is a full-stack fleet and delivery management system built to manage **customers, drivers, vehicles, delivery orders, and real-time driver tracking** from a single platform.

The system uses **Spring Boot** for the backend, **React** for the frontend, **MySQL** for permanent data storage, **Redis** for fast driver state access, **Kafka** for event-driven communication, and **WebSocket** for real-time tracking updates.

---

## Features

- Customer Management
-  Driver Management
- Vehicle Management
-  Delivery Order Management
-  Real-Time Driver Location Tracking
-  JWT Authentication
-  Role-Based Authorization
-  Redis-based Driver State
- Kafka Event Processing
- WebSocket Real-Time Updates
- Dashboard for Fleet Operations
-  React-based Web Interface
-  MySQL Database

---

##  System Architecture

```tetx
                    ┌─────────────────────┐
                    │      React UI       │
                    │   Vite + Tailwind   │
                    └──────────┬──────────┘
                               │
                          REST / WebSocket
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Spring Boot     │
                    │      Backend       │
                    └───────┬───┬───┬────┘
                            │   │   │
              ┌─────────────┘   │   └─────────────┐
              ▼                 ▼                 ▼
        ┌───────────┐      ┌─────────┐      ┌─────────┐
        │   MySQL   │      │  Redis  │      │  Kafka  │
        │ Permanent │      │ Current │      │ Events  │
        │   Data    │      │  State  │      │         │
        └───────────┘      └─────────┘      └────┬────┘
                                                  │
                                                  ▼
                                           ┌─────────────┐
                                           │  WebSocket  │
                                           │ Real-Time UI │
                                           └─────────────┘           

                                           
Technology Stack
Backend
- Java 25
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT
- BCrypt
- Maven
Database & Caching
- MySQL
- Redis
Event Processing
- Apache Kafka
- Kafka Producer
- Kafka Consumer
- Kafka Topics
Real-Time Communication
- WebSocket
- STOMP
Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Leaflet
- React Leaflet
Development Tools
- IntelliJ IDEA
- VS Code
- Postman
- Git
- GitHub
📁 Project Structure
SmartFleet/
│
├── backend/
│   └── smartfleet/
│       │
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── com/smartfleet/smartfleet/
│       │   │   │       │
│       │   │   │       ├── auth/
│       │   │   │       ├── config/
│       │   │   │       ├── customer/
│       │   │   │       ├── driver/
│       │   │   │       ├── kafka/
│       │   │   │       ├── order/
│       │   │   │       ├── redis/
│       │   │   │       ├── vehicle/
│       │   │   │       └── websocket/
│       │   │   │
│       │   │   └── resources/
│       │   │       └── application.yaml
│       │   │
│       │   └── test/
│       │
│       ├── pom.xml
│       ├── mvnw
│       └── mvnw.cmd
│
├── smartfleet-frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── package-lock.json
│
└── README.md

 Authentication & Authorization
SmartFleet uses Spring Security, JWT, and BCrypt to secure the backend APIs.
Authentication
The login process works as follows:

User
 │
 │ username + password
 ▼
Login API
 │
 ▼
Spring Security
 │
 ▼
BCrypt Password Verification
 │
 ▼
JWT Generated
 │
 ▼
Frontend Stores JWT
 │
 ▼
JWT Sent with API Requests

The frontend sends the token using:
Authorization: Bearer <JWT_TOKEN>

The backend's JWT filter validates the token before allowing access to protected APIs.

👤 User Roles
SmartFleet currently supports:
ADMIN
Has access to administrative operations including:
- Customer management
- Driver management
- Vehicle management
- Orders
- Tracking
DISPATCHER
Can access operational functionality such as:
- Viewing customers
- Viewing drivers
- Viewing vehicles
- Managing orders
- Driver tracking
Role-based access is enforced using Spring Security.

👥 Customer Management
SmartFleet provides REST APIs for managing customers.
A customer contains information such as:
Customer
├── ID
├── Name
├── Email
├── Phone
└── Address

🚗 Driver Management
Drivers are managed through the backend.
Driver information includes:
Driver
├── ID
├── Name
├── Phone
├── License Number
├── Status
├── Latitude
└── Longitude

Driver statuses include:
AVAILABLE
ON_DELIVERY
OFFLINE

Example:
{
  "id": 1,
  "name": "Rahul Kumar",
  "phone": "9876543210",
  "licenseNumber": "KA123456789",
  "status": "ON_DELIVERY",
  "latitude": 12.975,
  "longitude": 77.6
}

🚛 Vehicle Management
Vehicles can be created, viewed, updated, and deleted.
Vehicle
├── ID
├── Vehicle Number
├── Vehicle Type
├── Capacity
├── Status
└── Driver ID
Vehicle statuses include:
AVAILABLE
IN_USE
MAINTENANCE

Vehicles can be associated with drivers during order assignment.

📦 Order Management
SmartFleet manages the complete delivery order lifecycle.
The order flow is:
CREATED
   ↓
ASSIGNED
   ↓
PICKED_UP
   ↓
IN_TRANSIT
   ↓
DELIVERED

Apache Kafka
Kafka is used for event-driven communication in SmartFleet.
The project uses Kafka for events such as:
ORDER_CREATED
DRIVER_LOCATION

The basic flow is:
Producer
   ↓
Kafka Topic
   ↓
Consumer
   ↓
Business Logic

Order Event
Order Created
      ↓
OrderEventProducer
      ↓
order-created topic
      ↓
OrderEventConsumer

Driver Location Event
Driver Location Updated
          ↓
DriverLocationProducer
          ↓
driver-location topic
          ↓
DriverLocationConsumer
          ↓
TrackingService

Kafka allows these events to be processed asynchronously.

📍 Real-Time Driver Tracking
One of the main features of SmartFleet is real-time driver location tracking.
The complete flow is:

Driver Location
      ↓
Spring Boot
      ↓
Redis
      │
      └──────────────► Current Location
      ↓
Kafka
      ↓
driver-location
      ↓
DriverLocationConsumer
      ↓
TrackingService
      ↓
WebSocket
      ↓
/topic/driver-location
      ↓
React Frontend
      ↓
Live Map

Live Tracking Map:
The frontend uses:
- Leaflet
- React Leaflet
- WebSocket
- STOMP
The tracking page displays driver locations on a map.

entire SmartFleet workflow:
┌─────────────────────────────────────────────────────────────────────┐
│                         SMARTFLEET                                  │
│          Real-Time Fleet & Delivery Management System               │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌──────────────────────┐
                    │      React UI        │
                    │  Vite + Tailwind CSS │
                    └──────────┬───────────┘
                               │
                     Login / REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Spring Boot API    │
                    │   Port: 8080         │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼─────────────────┐
              │                │                 │
              ▼                ▼                 ▼
       ┌────────────┐   ┌────────────┐    ┌────────────┐
       │   Spring   │   │   Spring   │    │  Spring    │
       │  Security  │   │   Services │    │ Controllers│
       └─────┬──────┘   └─────┬──────┘    └─────┬──────┘
             │                │                  │
             ▼                ▼                  ▼
       ┌────────────┐   ┌────────────┐    ┌────────────┐
       │    JWT     │   │   MySQL    │    │  REST APIs │
       │    +       │   │            │    │            │
       │   BCrypt   │   │ Permanent  │    │ Customers  │
       │            │   │    Data    │    │ Drivers    │
       └────────────┘   └────────────┘    │ Vehicles   │
                                          │ Orders     │
                                          └─────┬──────┘
                                                │
                                                ▼
                                  ┌────────────────────────┐
                                  │     ORDER WORKFLOW     │
                                  │                        │
                                  │ CREATED                │
                                  │    ↓                   │
                                  │ ASSIGNED               │
                                  │    ↓                   │
                                  │ PICKED_UP              │
                                  │    ↓                   │
                                  │ IN_TRANSIT             │
                                  │    ↓                   │
                                  │ DELIVERED              │
                                  └───────────┬────────────┘
                                              │
                                              ▼
                                   ┌────────────────────┐
                                   │ Driver + Vehicle   │
                                   │ Assignment         │
                                   └─────────┬──────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │   DRIVER LOCATION    │
                                  │                      │
                                  │ Latitude + Longitude │
                                  │ Driver Status        │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                      ┌─────────────┐
                                      │    Redis    │
                                      │             │
                                      │ Current     │
                                      │ Driver      │
                                      │ State       │
                                      │             │
                                      │ TTL: 60 sec │
                                      └──────┬──────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │   Kafka Producer     │
                                  │                      │
                                  │ driver-location      │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │    Kafka Topic       │
                                  │ driver-location      │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │ Kafka Consumer       │
                                  │ DriverLocation       │
                                  │ Consumer              │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │   TrackingService    │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │      WebSocket       │
                                  │                      │
                                  │ /topic/driver-      │
                                  │ location             │
                                  └──────────┬───────────┘
                                             │
                                             ▼
                                  ┌──────────────────────┐
                                  │     React Live Map   │
                                  │                      │
                                  │   📍 Driver Location │
                                  └──────────────────────┘


        
## Running the Project Locally
Prerequisites:
Make sure you have installed:
Java 25
Maven
Node.js
MySQL
Redis
Apache Kafka
Git

#Clone the Repository
git clone https://github.com/YOUR_USERNAME/SmartFleet.git

cd SmartFleet

2. Start MySQL
Create the database:
CREATE DATABASE smartfleet;

Make sure your MySQL credentials match your backend configuration.
3. Start Redis
Start your local Redis server.
Default:
localhost:6379

4. Start Kafka
Start Kafka in KRaft mode.
Default:
localhost:9092

5. Start Spring Boot Backend
Go to:
cd backend/smartfleet

Run:
Windows
mvnw.cmd spring-boot:run

or:
mvn spring-boot:run

Backend runs on:
http://localhost:8080

6. Start React Frontend
Open another terminal:
cd smartfleet-frontend

Install dependencies:
npm install

Start the frontend:
npm run dev

Frontend runs on:
http://localhost:5173

Development Login
For local development, the application initializes development users.
Admin
Username: admin
Password: Admin@12345
Role: ADMIN

Dispatcher
Username: dispatcher
Password: Test@12345
Role: DISPATCHER

These credentials are intended for local development/demo purposes. Change them before using the application in a real production environment.

🔒 Security
The application implements:
- JWT authentication
- BCrypt password hashing
- Spring Security
- Role-based authorization
- Protected REST APIs
- Bearer token authentication
- Frontend protected routes
The frontend automatically attaches the JWT to API requests using an Axios interceptor.


##Future Improvements
Possible future improvements include:
- Production deployment
- Environment-based configuration
- Refresh tokens
- Better monitoring and logging
- Automated testing
- Docker-based deployment
- Cloud infrastructure
- Improved analytics

## Project Highlights
SmartFleet demonstrates practical experience with:
Java
Spring Boot
REST APIs
Spring Security
JWT
BCrypt
MySQL
Redis
Apache Kafka
WebSocket
React
Tailwind CSS
Axios
Leaflet
Git
GitHub

The project combines traditional REST APIs with event-driven and real-time communication to create a complete fleet and delivery management application.

👨‍💻 Author
MOHD Azhar Sohail
Computer Science Engineering — Data Science
Interested in:
- Software Engineering
- Java Backend Development
- Full-Stack Development
- Data Science
- Machine Learning

⭐ If you find this project useful
Feel free to explore the code, learn from the implementation, and give the repository a star.




                                           
