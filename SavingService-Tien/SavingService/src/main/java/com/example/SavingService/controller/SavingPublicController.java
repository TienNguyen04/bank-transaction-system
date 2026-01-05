package com.example.SavingService.controller;



import com.example.SavingService.service.SavingService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/public")
public class SavingPublicController {

    private final SavingService savingService;

    public SavingPublicController(SavingService savingService) {
        this.savingService = savingService;
    }

    @GetMapping("/test")
    public int test( @RequestHeader ("X-User-Id") int userId) {
        return userId;
    }

}

