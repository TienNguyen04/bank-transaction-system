package com.example.SavingService.dto.response;

public record APIRes<T> (
         String status,
        //String context,
        T data
){


}
