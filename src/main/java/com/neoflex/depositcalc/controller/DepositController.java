package com.neoflex.depositcalc.controller;

import com.neoflex.depositcalc.dto.DepositRequest;
import com.neoflex.depositcalc.dto.DepositResponse;
import com.neoflex.depositcalc.service.DepositService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor // она(Lombok) создаст конструктор для final-поля depositService!(Внедряю сервис через конструктор)
// Внедрение через конструктор лучше, чем через @Autowired(поле(тут не получится поставить final) или метод):
// Иммутабельность(final поле),
// проще тестировать(можно мокнуть, передать заглушку new DepositController(mockService))
//Защита от ошибок (NullPointerException): Spring просто не позволит приложению запуститься, если он не сможет найти нужный бин DepositService для передачи в конструктор
@RestController //точка входа для сетевых HTTP-запросов, содержит в себе @Controller, @ResponseBody
@RequestMapping("/api")
@CrossOrigin(origins = "*") // @CrossOrigin разрешает нашему будущему React-фронтенду слать запросы на бэкенд
public class DepositController {

    private final DepositService depositService;

    // Эндпоинт для расчета вклада.
    @PostMapping("/calculate")
    public DepositResponse calculateDeposit(@Valid @RequestBody DepositRequest request) {
        return depositService.calculate(request);
    }
}
