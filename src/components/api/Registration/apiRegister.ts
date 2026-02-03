import axios from 'axios';
import { RegisterRequest, UserResponse } from '../../types/auth';

export const register = async (data: RegisterRequest): Promise<UserResponse> => {
    try {
        console.log('Отправка запроса регистрации:', data);

        const response = await axios.post<UserResponse>(
            `${process.env.REACT_APP_API_URL}/auth/register`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('Регистрация успешна:', response.data);
        return response.data;

    } catch (error: any) {
        console.error('Ошибка при регистрации:', error);

        if (axios.isAxiosError(error) && error.response) {
            const errorData = error.response.data;

            let errorMessage = 'Ошибка регистрации';

            if (errorData?.detail) {
                errorMessage = errorData.detail;
            } else if (typeof errorData === 'string') {
                errorMessage = errorData;
            } else if (errorData?.message) {
                errorMessage = errorData.message;
            }

            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
        } else {
            throw new Error('Произошла ошибка при отправке запроса');
        }
    }
};