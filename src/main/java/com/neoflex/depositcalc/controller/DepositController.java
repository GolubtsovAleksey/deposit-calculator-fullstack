package com.neoflex.depositcalc.controller;

import com.neoflex.depositcalc.dto.DepositRequest;
import com.neoflex.depositcalc.dto.DepositResponse;
import com.neoflex.depositcalc.service.DepositService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

//точка входа для сетевых HTTP-запросов, содержит в себе @Controller, @ResponseBody
@RestController
@RequestMapping("/api")
// @CrossOrigin разрешает нашему будущему React-фронтенду слать запросы на бэкенд
@CrossOrigin(origins = "*")
public class DepositController {

    private final DepositService depositService;

    // Внедряю сервис через конструктор
    public DepositController(DepositService depositService) {
        this.depositService = depositService;
    }

    // Эндпоинт для расчета вклада.
    @PostMapping("/calculate")
    public DepositResponse calculateDeposit(@Valid @RequestBody DepositRequest request) {
        return depositService.calculate(request);
    }
}
