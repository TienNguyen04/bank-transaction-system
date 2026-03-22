package com.example.SavingService.controller;

import com.example.SavingService.dto.response.APIRes;
import com.example.SavingService.dto.request.CloseSavingInternalRequest;
import com.example.SavingService.dto.request.CreateNotificationRequest;
import com.example.SavingService.dto.request.OpenSavingRequest;
import com.example.SavingService.service.SavingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
//import org.springframework.web.client.RestTemplate;
import com.example.SavingService.config.RestConfig;
import org.springframework.web.client.RestTemplate;
//import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/private")
public class SavingPrivateController {

    private final SavingService savingService;
    @Autowired
    private RestTemplate restTemplate;

    public SavingPrivateController(SavingService savingService, RestTemplate restTemplate) {
        this.savingService = savingService;
        this.restTemplate = restTemplate;
    }
    @PostMapping("/opensaving")
    public APIRes<OpenSavingRequest> openSaving(
            @RequestHeader ("X-User-Id") int userId,
            @RequestBody OpenSavingRequest addBalanceRequest) {
        return savingService.openSaving(userId,addBalanceRequest.getBalance(),addBalanceRequest.getTerm());
    }
    @PostMapping("/closesaving")
    public ResponseEntity<?> closeSaving(
            @RequestHeader("X-User-Id") int userId,
            @RequestBody CloseSavingInternalRequest req
    ) {
        savingService.closeSaving(userId, req.getSavingAccountNumber());

        return ResponseEntity.ok("Close saving success");
    }
}

