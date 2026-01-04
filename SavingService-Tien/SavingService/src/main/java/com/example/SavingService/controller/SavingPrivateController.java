package com.example.SavingService.controller;

import com.example.SavingService.dto.CloseSavingInternalRequest;
import com.example.SavingService.service.SavingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("/saving")
public class SavingPrivateController {

    private final SavingService savingService;

    public SavingPrivateController(SavingService savingService) {
        this.savingService = savingService;
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

