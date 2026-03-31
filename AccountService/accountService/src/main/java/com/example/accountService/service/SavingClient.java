package com.example.accountService.service;

import com.example.accountService.dto.request.CloseSavingInternalRequest;
import com.example.accountService.dto.request.OpenSavingAccReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;

@Service
public class SavingClient {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${saving.service.url}")
    private String savingServiceUrl="http://localhost:8083/savingService-Tien";
    @Transactional
    public void closeSaving(int userId, String savingAccountNumber) {

        // 1️⃣ Header
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.add("X-User-Id", String.valueOf(userId));

        // 2️⃣ Body
        CloseSavingInternalRequest body =
                new CloseSavingInternalRequest(savingAccountNumber);

        // 3️⃣ Entity
        HttpEntity<CloseSavingInternalRequest> entity =
                new HttpEntity<>(body, headers);

        // 4️⃣ Call
        restTemplate.postForEntity(
                savingServiceUrl + "/private/closesaving",
                entity,
                Void.class
        );

    }
    public void openSaving(int userId, BigDecimal balance, String term) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("X-User-Id", String.valueOf(userId));

        OpenSavingAccReq body = new OpenSavingAccReq(
                balance, term
        );

        HttpEntity<OpenSavingAccReq> entity =
                new HttpEntity<>(body, headers);

        // 4️ Call
        restTemplate.postForEntity(
                savingServiceUrl + "/private/opensaving",
                entity,
                Void.class
        );
    }
}
