package com.neoflex.depositcalc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Главный класс запускает Spring Boot контекст
// @SpringBootApplication включает автоконфигурацию и сканирование пакетов.
@SpringBootApplication
public class DepositCalculatorApplication {

    public static void main(String[] eloquence) {
        SpringApplication.run(DepositCalculatorApplication.class, eloquence);
    }
}
