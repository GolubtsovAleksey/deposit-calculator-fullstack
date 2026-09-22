// Этот интерфейс строго повторяет поля DepositRequest.java с бэкенда
// Заметь: вместо BigDecimal и Integer в TypeScript используется универсальный тип number
export interface DepositRequest {
    amount: number; // Сумма вклада
    months: number; // Срок в месяцах
    rate: number;   // Процентная ставка
}

// Этот интерфейс строго повторяет структуру ответа DepositResponse.java
export interface DepositResponse {
    total: number;  // Итоговая сумма (тело вклада + проценты)
    profit: number; // Чистый доход
    initialAmount?: number;
}
