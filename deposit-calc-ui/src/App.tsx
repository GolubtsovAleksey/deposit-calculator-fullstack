import { useState } from 'react';
import axios from 'axios';
import type { ChangeEvent } from 'react';
import type { DepositRequest, DepositResponse } from './types';


export default function App() {
    const [formData, setFormData] = useState<DepositRequest>({
        amount: 100000,
        months: 12,
        rate: 10,
    });

    const [result, setResult] = useState<DepositResponse | null>(null);

    // 🌟 Теперь здесь хранится МАССИВ строк, а не одна строка
    const [errors, setErrors] = useState<string[]>([]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value === '' ? 0 : Number(value),
        }));
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setErrors([]); // Очищаем прошлые ошибки перед расчетом

        // Создаем временный список (как ArrayList в Java) для сбора всех ошибок
        const validationErrors: string[] = [];

        // Проверяем Сумму
        if (formData.amount < 1000 || formData.amount > 10000000) {
            validationErrors.push('Сумма вклада должна быть от 1 000 до 10 000 000 ₽');
        }

        // Проверяем Срок
        if (formData.months < 1 || formData.months > 60) {
            validationErrors.push('Срок вклада должен быть от 1 до 60 месяцев');
        }

        // Проверяем Ставку
        if (formData.rate < 1 || formData.rate > 20) {
            validationErrors.push('Процентная ставка должна быть от 1% до 20%');
        }

        // Если хотя бы одна ошибка нашлась — прерываем отправку и показываем их все
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setResult(null);
            return;
        }

        try {
            const response = await axios.post<DepositResponse>('http://localhost:8080/api/calculate', formData);
            setResult(response.data);
        } catch (err) {
            setResult(null);
            setErrors(['Ошибка: бэкенд-сервер недоступен. Убедись, что Spring Boot запущен.']);
        }
    };

    return (
        <div style={{
            backgroundColor: '#f4f5f7',
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'Arial, sans-serif',
            margin: 0,
            padding: 0,
            boxSizing: 'border-box'
        }}>

            <div style={{ maxWidth: '300px', width: '100%', padding: '20px' }}>

                {/* ВЫВОД СПИСКА ОШИБОК: проверяем, есть ли элементы в массиве (как errors.size() > 0 в Java) */}
                {errors.length > 0 && (
                    <div style={{
                        color: '#d32f2f',
                        backgroundColor: '#ffebee',
                        padding: '12px',
                        borderRadius: '4px',
                        marginBottom: '15px',
                        fontSize: '13px',
                        textAlign: 'left', // Списком удобнее читать с выравниванием по левому краю
                        border: '1px solid #ffcdd2'
                    }}>
                        {/* Проходимся по массиву ошибок методом .map() и выводим каждую с новой строки */}
                        {errors.map((err, index) => (
                            <div key={index} style={{ marginBottom: index === errors.length - 1 ? 0 : '6px' }}>
                                • {err}
                            </div>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', color: '#333' }}>Сумма вклада (₽)</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount || ''}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', color: '#333' }}>Срок вклада (месяцев)</label>
                        <input
                            type="number"
                            name="months"
                            value={formData.months || ''}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '4px', color: '#333' }}>Ставка (% годовых)</label>
                        <input
                            type="number"
                            step="0.1"
                            name="rate"
                            value={formData.rate || ''}
                            onChange={handleChange}
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                    </div>

                    <button type="submit" style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#0066cc',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginBottom: '20px'
                    }}>
                        Рассчитать
                    </button>
                </form>

                {result && (
                    <div style={{ borderTop: '1px solid #ccc', paddingTop: '15px', marginTop: '10px' }}>
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
