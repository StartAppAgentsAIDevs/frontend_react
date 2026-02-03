import axios, { AxiosError } from 'axios';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}

// Экземпляр axios для перехвата ошибок
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Перехватчик для обновления токена при 401 ошибке
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (refreshToken) {
                    const response = await axios.post<LoginResponse>(
                        `${process.env.REACT_APP_API_URL}/auth/refresh`,
                        { refresh_token: refreshToken }
                    );

                    const newTokens = response.data;
                    localStorage.setItem('access_token', newTokens.access_token);
                    localStorage.setItem('refresh_token', newTokens.refresh_token);

                    // Обновляем токен в оригинальном запросе
                    originalRequest.headers['Authorization'] = `Bearer ${newTokens.access_token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Если refresh не удался, делаем логаут
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_email');
                window.location.href = '/auth';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

// Добавляем токен к запросам
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        console.log('Отправка запроса авторизации:', { ...data, password: '***' });

        const response = await api.post<LoginResponse>('/auth/login', data);

        console.log('Авторизация успешна:', response.data);

        return response.data;

    } catch (error: any) {
        console.error('Ошибка при авторизации:', error);

        if (axios.isAxiosError(error) && error.response) {
            const errorData = error.response.data;
            let errorMessage = 'Ошибка авторизации';

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

            if (error.response.status === 401) {
                errorMessage = 'Неверный email или пароль';
            }

            throw new Error(errorMessage);
        } else if (error.request) {
            throw new Error('Сервер не отвечает. Проверьте подключение к интернету.');
        } else {
            throw new Error('Произошла ошибка при отправке запроса');
        }
    }
};

export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/refresh', {
        refresh_token: refreshToken,
    });
    return response.data;
};

export const logout = (): void => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('remember_me');
};

export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('access_token');
};

export const getCurrentUser = () => {
    const email = localStorage.getItem('user_email');
    return email ? { email } : null;
};

export { api };