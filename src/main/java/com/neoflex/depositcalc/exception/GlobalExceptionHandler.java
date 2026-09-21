package com.neoflex.depositcalc.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.HashMap;
import java.util.Map;

// через Спринг перехватывает ошибки во всех контроллерах.
@RestControllerAdvice
public class GlobalExceptionHandler {

// Этот метод перехватывает именно MethodArgumentNotValidException.
// Это исключение выбрасывает Spring Boot, когда данные в @Valid @RequestBody не проходят валидацию.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        // Пробегаемся по всем ошибкам валидации, которые нашел Spring
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            String fieldName = error.getField();          // Имя поля (например, "amount")
            String errorMessage = error.getDefaultMessage(); // Текст (например, "Минимальная сумма — 1 000 рублей")

            errors.put(fieldName, errorMessage);
        }

        // Возвращаю фронтенду статус 400 Bad Request, но вместо системной портянки
        // отдаю Map с текстами ошибок
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

     //Перехватывает ошибки парсинга (буквы, спецсимволы вместо чисел)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, String>> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        Map<String, String> errors = new HashMap<>();

        // отдаю общее понятное сообщение для фронтенда.
        errors.put("error", "Неверный формат данных. Пожалуйста, вводите только числа.");

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }
}
