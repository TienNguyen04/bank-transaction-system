package com.example.SavingService.controller;



import com.example.SavingService.dto.CloseSavingInternalRequest;
import com.example.SavingService.service.SavingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/publicsaving")
public class SavingPublicController {

    private final SavingService savingService;

    public SavingPublicController(SavingService savingService) {
        this.savingService = savingService;
    }


}

