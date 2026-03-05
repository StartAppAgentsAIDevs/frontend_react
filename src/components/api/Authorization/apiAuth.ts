import axios, { AxiosError } from 'axios';
import { api } from '../api'

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

// Время жизни токенов (в днях)
const ACCESS_TOKEN_EXPIRY_DAYS = 1;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;


// Функция для установки cookie на клиенте
export const setCookie = (name: string, value: string, days: number = 7) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax${process.env.NODE_ENV === 'production' ? ';Secure' : ''}`;
};

// Функция для получения cookie
export const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

// Функция для удаления cookie
export const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
};

// Сохраняем токены в cookies
export const saveTokens = (tokens: LoginResponse) => {
    setCookie('access_token', tokens.access_token, ACCESS_TOKEN_EXPIRY_DAYS);
    setCookie('refresh_token', tokens.refresh_token, REFRESH_TOKEN_EXPIRY_DAYS);
};

// Альтернативная функция для сохранения только access и refresh токенов
export const saveAuthTokens = (accessToken: string, refreshToken: string) => {
    setCookie('access_token', accessToken, ACCESS_TOKEN_EXPIRY_DAYS);
    setCookie('refresh_token', refreshToken, REFRESH_TOKEN_EXPIRY_DAYS);
};

// Очищаем все токены
export const clearTokens = () => {
    deleteCookie('access_token');
    deleteCookie('refresh_token');
    deleteCookie('user_email');
    deleteCookie('remember_me');
};

export const getAccessToken = (): string | null => {
    return getCookie('access_token');
};

export const getRefreshToken = (): string | null => {
    return getCookie('refresh_token');
};

// Перехватчик для обновления токена при 401 ошибке
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getRefreshToken();
                if (refreshToken) {
                    const response = await axios.post<LoginResponse>(
                        `${process.env.REACT_APP_API_URL}/auth/refresh`,
                        { refresh_token: refreshToken }
                    );

                    const newTokens = response.data;
                    saveTokens(newTokens);

                    originalRequest.headers['Authorization'] = `Bearer ${newTokens.access_token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                clearTokens();
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
        const token = getAccessToken();
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

        saveTokens(response.data);

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

// API выхода
export const logoutApi = async (): Promise<void> => {
    try {
        const refreshToken = getRefreshToken();
        if (refreshToken) {
            await api.post('/auth/logout', {
                refresh_token: refreshToken
            });
        } else {
            await api.post('/auth/logout');
        }
    } catch (error) {
        console.error('Ошибка при выходе:', error);
    } finally {
        clearTokens();
    }
};

export const refreshTokenApi = async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/refresh', {
        refresh_token: refreshToken,
    });
    return response.data;
};

export const refreshToken = async (): Promise<boolean> => {
    try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            clearTokens();
            return false;
        }

        const response = await refreshTokenApi(refreshToken);
        saveTokens(response);
        return true;
    } catch (error) {
        console.error('Token refresh error:', error);
        clearTokens();
        return false;
    }
};

export const logout = async (): Promise<void> => {
    await logoutApi();
};

export const isAuthenticated = (): boolean => {
    return !!getAccessToken();
};

export const getCurrentUser = () => {
    const token = getAccessToken();
    if (token) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const email = payload.email || payload.sub;
            return email ? { email } : null;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }
    return null;
};