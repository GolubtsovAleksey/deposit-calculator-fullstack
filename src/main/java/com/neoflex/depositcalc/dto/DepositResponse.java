package com.neoflex.depositcalc.dto;

import java.math.BigDecimal;


//DTO для отправки JSON-ответа с результатами расчета.
public class DepositResponse {

    private BigDecimal total;  // Итоговая сумма с процентами
    private BigDecimal profit; // Чистая прибыль (доход)

    public DepositResponse(BigDecimal total, BigDecimal profit) {
        this.total = total;
        this.profit = profit;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public BigDecimal getProfit() {
        return profit;
    }
}
