package com.example.accountService.userService;

import com.example.accountService.dto.response.UserRes;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name ="user-service",
        url="http://localhost:8081/user-service"
)
public interface UserService {
    @GetMapping("/user/{userID}")
    UserRes getUser(@PathVariable int id);
}
