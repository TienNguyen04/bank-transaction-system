user-service/
├── src/main/java/com/bank/userservice/
│   ├── UserServiceApplication.java
│   ├── config/
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── SecurityConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   └── InternalApiController.java
│   ├── dto/
│   │   ├── AuthRequest.java
│   │   ├── AuthResponse.java
│   │   ├── UserCreateRequest.java
│   │   ├── UserResponse.java
│   │   ├── UserUpdateRequest.java
│   │   └── ChangePasswordRequest.java
│   ├── entity/
│   │   └── User.java
│   ├── repository/
│   │   └── UserRepository.java
│   ├── service/
│   │   ├── UserService.java
│   │   └── impl/
│   │       └── UserServiceImpl.java
│   └── exception/
│       ├── UserNotFoundException.java
│       ├── UnauthorizedException.java
│       └── GlobalExceptionHandler.java
├── src/main/resources/
│   ├── application.properties
│   └── application.yml
└── pom.xml