package com.neoflex.depositcalc.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

// DepositRequest (DTO) служит контейнером для данных,
// которые фронтенд отправляет на сервер в формате JSON.
public class DepositRequest {

    // Сумма вклада: от 1 000 до 10 000 000 рублей по ТЗ
    @NotNull(message = "Сумма вклада не может быть пустой")
    @Min(value = 1000, message = "Минимальная сумма вклада — 1 000 рублей")
    @Max(value = 10000000, message = "Максимальная сумма вклада — 10 000 000 рублей")
    private BigDecimal amount;

    // Срок в месяцах: от 1 до 60 месяцев по ТЗ
    @NotNull(message = "Срок вклада не может быть пустым")
    @Min(value = 1, message = "Минимальный срок — 1 месяц")
    @Max(value = 60, message = "Максимальный срок — 60 месяцев")
    private Integer months;

    // Годовая ставка: от 1% до 20% по ТЗ
    @NotNull(message = "Ставка не может быть пустой")
    @Min(value = 1, message = "Минимальная ставка — 1%")
    @Max(value = 20, message = "Максимальная ставка — 20%")
    private BigDecimal rate;

    public BigDecimal getAmount() {
        return amount;
    }

    public Integer getMonths() {
        return months;
    }

    public BigDecimal getRate() {
        return rate;
    }

    //тут сеттеры нужны для десериализации Jackson из части фронтенд.
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public void setMonths(Integer months) {
        this.months = months;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

}
