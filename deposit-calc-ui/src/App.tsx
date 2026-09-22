import { useState } from 'react';
// Объединяем импорты типов в одну строку, чтобы у линтера не было предупреждений (warnings)
import type { ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import type { DepositRequest, DepositResponse } from './types';

export default function App() {
    // 1. СОСТОЯНИЕ ФОРМЫ (Управляемый компонент)
    // Объект formData хранит текущие значения полей. Инициализируем дефолтными значениями.
    const [formData, setFormData] = useState<DepositRequest>({
        amount: 100000,
        months: 12,
        rate: 10,
    });

    // 2. СОСТОЯНИЕ РЕЗУЛЬТАТА РАСЧЕТА
    // Хранит объект ответа от сервера или null, если расчет еще не производился.
    const [result, setResult] = useState<DepositResponse | null>(null);

    // 3. СОСТОЯНИЕ ОШИБОК ВАЛИДАЦИИ
    // Массив строк для одновременного хранения и вывода всех ошибок.
    const [errors, setErrors] = useState<string[]>([]);

    /**
     * Универсальный обработчик изменения полей ввода (input).
     * Динамически обновляет нужное поле в стейте по его атрибуту 'name'.
     */
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        // Используем функцию-колбэк (prevData) для защиты от асинхронных гонок девайсов.
        // Spread-оператор (...) гарантирует ИММУТАБЕЛЬНОСТЬ: создается новый объект в памяти,
        // старые поля сохраняются, а измененное поле перезаписывается.
        setFormData((prevData) => ({
            ...prevData,
            [name]: value === '' ? 0 : Number(value), // Приводим строку из инпута к числу
        }));
    };

    /**
     * Обработчик отправки формы.
     * event: FormEvent<HTMLFormElement> — строгий тип React для отправки форм вместо "any".
     */
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        // Отменяем дефолтное поведение браузера (перезагрузку страницы при отправке формы)
        event.preventDefault();

        // Сбрасываем старые ошибки перед началом новой валидации
        setErrors([]);

        // Временный массив-буфер (как ArrayList в Java) для сбора ошибок на клиенте
        const validationErrors: string[] = [];

        // Множественная валидация по бизнес-требованиям ТЗ
        if (formData.amount < 1000 || formData.amount > 10000000) {
            validationErrors.push('Сумма вклада должна быть от 1 000 до 10 000 000 ₽');
        }
        if (formData.months < 1 || formData.months > 60) {
            validationErrors.push('Срок вклада должен быть от 1 до 60 месяцев');
        }
        if (formData.rate < 1 || formData.rate > 20) {
            validationErrors.push('Процентная ставка должна быть от 1% до 20%');
        }

        // Если есть хотя бы одна ошибка, прерываем отправку на бэкенд
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setResult(null); // Прячем прошлый результат расчета, если новые данные некорректны
            return;
        }

        try {
            // Отправляем асинхронный POST-запрос на Spring Boot бэкенд через Axios
            const response = await axios.post<DepositResponse>('http://localhost:8080/api/calculate', formData);

            // Архитектурное решение: Записываем в стейт данные ответа бэкенда
            // и подмешиваем туда initialAmount прямо из текущей формы.
            // Это предотвращает баг, когда пользователь меняет инпут ПОСЛЕ расчета,
            // а значение "Начальная сумма" внизу начинает неконтролируемо дергаться.
            setResult({
                ...response.data,
                initialAmount: formData.amount
            });
        } catch (err) {
            // Если бэкенд упал или недоступен — обрабатываем исключение сетевого слоя
            setResult(null);
            setErrors(['Ошибка: бэкенд-сервер недоступен. Убедись, что Spring Boot запущен.']);
        }
    };

    return (
        <div style={{
            backgroundColor: '#f4f5f7', minHeight: '100vh', width: '100vw',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, boxSizing: 'border-box'
        }}>
            <div style={{ maxWidth: '300px', width: '100%', padding: '20px' }}>

                {/* БЛОК ОШИБОК: Рендерится, только если в массиве errors есть элементы */}
                {errors.length > 0 && (
                    <div style={{
                        color: '#d32f2f', backgroundColor: '#ffebee', padding: '12px',
                        borderRadius: '4px', marginBottom: '15px', fontSize: '13px',
                        textAlign: 'left', border: '1px solid #ffcdd2'
                    }}>
                        {/* Метод .map() трансформирует массив строк в массив JSX-элементов (аналог Stream.map в Java).
                Атрибут key={index} критически важен для Virtual DOM React, чтобы он эффективно обновлял список */}
                        {errors.map((err, index) => (
                            <div key={index} style={{ marginBottom: index === errors.length - 1 ? 0 : '6px' }}>
                                • {err}
                            </div>
                        ))}
                    </div>
                )}

                {/* ФОРМА ВВОДА */}
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', color: '#333' }}>Сумма вклада (₽)</label>
                        <input type="number" name="amount" value={formData.amount || ''} onChange={handleChange}
                               style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', color: '#333' }}>Срок вклада (месяцев)</label>
                        <input type="number" name="months" value={formData.months || ''} onChange={handleChange}
                               style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', color: '#333' }}>Ставка (% годовых)</label>
                        <input type="number" step="0.1" name="rate" value={formData.rate || ''} onChange={handleChange}
                               style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>

                    <button type="submit" style={{
                        width: '100%', padding: '10px', backgroundColor: '#0066cc', color: 'white',
                        border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginBottom: '20px'
                    }}>Рассчитать</button>
                </form>

                {/* БЛОК РЕЗУЛЬТАТОВ: Показывается по ТЗ только после успешного ответа сервера */}
                {result && (
                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', marginTop: '10px' }}>

                        {/* ТРЕБОВАНИЕ ТЗ: Отображение зафиксированной изначальной суммы */}
                        <div style={{ marginBottom: '10px' }}>
                            <span style={{ fontSize: '13px', color: '#666' }}>Начальная сумма:</span>
                            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#444' }}>
                                {result.initialAmount?.toLocaleString('ru-RU')} ₽
                            </div>
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <span style={{ fontSize: '13px', color: '#666' }}>Итоговая сумма:</span>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#222' }}>
                                {result.total.toLocaleString('ru-RU')} ₽
                            </div>
                        </div>

                        <div>
                            <span style={{ fontSize: '13px', color: '#666' }}>Доход по вкладу:</span>
                            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'green' }}>
                                +{result.profit.toLocaleString('ru-RU')} ₽
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}
