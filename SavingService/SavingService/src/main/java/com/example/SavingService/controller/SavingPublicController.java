package com.example.SavingService.controller;



import com.example.SavingService.dto.request.CloseSavingInternalRequest;
import com.example.SavingService.dto.request.CreateNotificationRequest;
import com.example.SavingService.service.SavingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

@CrossOrigin(origins = {"*"})
@RestController
@RequestMapping("")
public class SavingPublicController {

    private final SavingService savingService;
    private final RestTemplate restTemplate;

    public SavingPublicController(SavingService savingService, RestTemplate restTemplate) {
        this.savingService = savingService;
        this.restTemplate = restTemplate;
    }

    @GetMapping("/test")
    public int test( @RequestHeader ("X-User-Id") int userId) {
        return userId;
    }
//    @PostMapping("/public/closesaving")
//    public ResponseEntity<?> closeSaving(
//            @RequestHeader("X-User-Id") int userId,
//            @RequestBody CloseSavingInternalRequest req
//    ) {
//        savingService.closeSaving(userId, req.getSavingAccountNumber());
//
//
//        restTemplate.postForEntity(
//                "http://localhost:8084/noti-Nguyet/private/create",
//                new CreateNotificationRequest(
//                        userId,
//                        "Tất toán sổ tiết kiệm",
//                        req.getSavingAccountNumber(),
//                        "Sổ tiết kiệm đã được tất toán thành công"
//                ),
//                Void.class
//        );
//
//        return ResponseEntity.ok("Close saving success");
//    }

}

