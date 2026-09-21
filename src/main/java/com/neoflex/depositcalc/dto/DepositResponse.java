package com.neoflex.depositcalc.dto;

import lombok.Value;

import java.math.BigDecimal;

// она(Lombok) делает все поля private final, создает геттеры и конструктор c полями total, profit; делает класс неизменяемым
// getTotal(), getProfit() используются во время тестового запроса, Без них Spring Boot выдаст ошибку 406 Not Acceptable!
@Value
public class DepositResponse {   //DTO для отправки JSON-ответа с результатами расчета.

    BigDecimal total;  // Итоговая сумма с процентами
    BigDecimal profit; // Чистая прибыль (доход)

}
