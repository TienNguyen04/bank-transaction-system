package com.example.SavingService.controller;

import com.example.SavingService.dto.response.APIRes;
import com.example.SavingService.dto.request.CloseSavingInternalRequest;
import com.example.SavingService.dto.request.CreateNotificationRequest;
import com.example.SavingService.dto.request.OpenSavingRequest;
import com.example.SavingService.service.SavingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/private")
public class SavingPrivateController {

    private final SavingService savingService;

    public SavingPrivateController(SavingService savingService) {
        this.savingService = savingService;
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
        RestTemplate restTemplate = null;
        restTemplate.postForEntity(
                "http://localhost:8084/noti-Nguyet/private/create",
                new CreateNotificationRequest(
                        userId,
                        "Tất toán sổ tiết kiệm",
                        req.getSavingAccountNumber(),
                        "Sổ tiết kiệm đã được tất toán thành công"
                ),
                Void.class
        );

        return ResponseEntity.ok("Close saving success");
    }
}

