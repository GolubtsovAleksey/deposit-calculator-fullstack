package com.neoflex.depositcalc.service;

import com.neoflex.depositcalc.dto.DepositRequest;
import com.neoflex.depositcalc.dto.DepositResponse;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
public class DepositService {

    // Расчет вклада с ежемесячной капитализацией процентов.
    // Формула по ТЗ: Итог = Сумма * (1 + Ставка / 100 / 12) ^ Срок_в_месяцах
    public DepositResponse calculate(DepositRequest request) {

        BigDecimal amount = request.getAmount();
        BigDecimal rate = request.getRate();
        int months = request.getMonths();

        // 1. Нахожу процентную ставку за один месяц (Ставка / 100 / 12 месяцев)
        // Задаю округление до 10 знаков после запятой (RoundingMode.HALF_UP).
        BigDecimal monthlyRate = rate.divide(new BigDecimal("1200"), 10, RoundingMode.HALF_UP);

        // 2. Считаю основание для возведения в степень: (1 + месячная ставка)
        BigDecimal base = BigDecimal.ONE.add(monthlyRate);

        // 3. Возвожу основание в степень, равную количеству месяцев
        BigDecimal multiplier = base.pow(months);

        // 4. Считаю итоговую сумму: Начальная сумма * Множитель
        // Округляю финальный результат до 2 знаков после запятой (банковское округление до копеек)
        BigDecimal total = amount.multiply(multiplier).setScale(2, RoundingMode.HALF_UP);

        // 5. Вычисляю чистую прибыль: Итоговая сумма - Начальная сумма
        BigDecimal profit = total.subtract(amount);

        // Возвращаю DTO
        return new DepositResponse(total, profit);
    }
}
