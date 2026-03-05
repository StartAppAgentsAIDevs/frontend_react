import { UserProfile } from '../../types/userData';
import { api } from '../api';
import { AxiosError } from 'axios';


export interface ApiError {
    detail?: string | { msg: string }[];
    message?: string;
    [key: string]: any;
}

export const getUserProfile = async (): Promise<UserProfile> => {
    try {
        console.log('Запрос профиля пользователя...');

        const response = await api.get<UserProfile>('/auth/me');

        console.log('Профиль пользователя получен:', response.data);
        return response.data;

    } catch (error: unknown) {
        console.error('Ошибка при получении профиля пользователя:', error);

        if (error instanceof Error && 'response' in error) {
            const axiosError = error as AxiosError<ApiError>;

            if (axiosError.response) {
                const errorData = axiosError.response.data;
                let errorMessage = 'Ошибка при получении данных пользователя';

                if (errorData?.detail) {
                    if (Array.isArray(errorData.detail)) {
                        const firstError = errorData.detail[0];
                        errorMessage = firstError?.msg || 'Ошибка валидации';
                    } else if (typeof errorData.detail === 'string') {
                        errorMessage = errorData.detail;
                    }
                } else if (errorData?.message) {
                    errorMessage = errorData.message;
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }

                if (axiosError.response.status === 401) {
                    errorMessage = 'Требуется авторизация';
                } else if (axiosError.response.status === 403) {
                    errorMessage = 'Доступ запрещен';
                }

                throw new Error(errorMessage);
            } else if (axiosError.request) {
                throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
            }
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Произошла неизвестная ошибка при получении данных пользователя');
    }
};


export const updateUserProfile = async (
    data: Partial<UserProfile>
): Promise<UserProfile> => {
    try {
        console.log('Обновление профиля пользователя:', data);

        const response = await api.patch<UserProfile>('/auth/me', data);

        console.log('Профиль пользователя обновлен:', response.data);
        return response.data;

    } catch (error: unknown) {
        console.error('Ошибка при обновлении профиля пользователя:', error);

        if (error instanceof Error && 'response' in error) {
            const axiosError = error as AxiosError<ApiError>;

            if (axiosError.response) {
                const errorData = axiosError.response.data;
                let errorMessage = 'Ошибка при обновлении данных пользователя';

                if (errorData?.detail) {
                    if (Array.isArray(errorData.detail)) {
                        const firstError = errorData.detail[0];
                        errorMessage = firstError?.msg || 'Ошибка валидации';
                    } else if (typeof errorData.detail === 'string') {
                        errorMessage = errorData.detail;
                    }
                } else if (errorData?.message) {
                    errorMessage = errorData.message;
                } else if (typeof errorData === 'string') {
                    errorMessage = errorData;
                }

                throw new Error(errorMessage);
            } else if (axiosError.request) {
                throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
            }
        }

        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Произошла неизвестная ошибка при обновлении данных пользователя');
    }
};


export const getUserFullName = (user: UserProfile | null): string => {
    if (!user) return 'Не указано';

    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const middleName = user.middle_name || '';

    const nameParts = [lastName, firstName, middleName].filter(part => part.trim());

    if (nameParts.length === 0) return 'Не указано';

    return nameParts.join(' ');
};


export const formatRegistrationDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    } catch {
        return 'Не указано';
    }
};


export const formatPhoneNumber = (phone: string | null): string => {
    if (!phone) return 'Не указано';

    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
        return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
    }

    return phone;
};