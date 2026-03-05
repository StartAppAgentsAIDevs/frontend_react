import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import {
    getAccessToken,
    getRefreshToken,
    saveTokens,
    saveAuthTokens,
    clearTokens,
    logoutApi,
    refreshToken as apiRefreshToken,
    LoginResponse
} from './apiAuth';
import { getUserProfile } from '../getUser/apiUserData';
import { UserProfile } from '../../types/userData';

// Обновляем интерфейс пользователя
interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (tokens: LoginResponse | { access_token: string; refresh_token: string }) => Promise<void>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<boolean>;
    fetchUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Функция для получения профиля пользователя
    const fetchUserProfile = async () => {
        try {
            const profile = await getUserProfile();
            setUser(profile);
        } catch (error: unknown) {
            console.error('Ошибка при получении профиля:', error);
            setUser(null);

            // Проверяем, является ли ошибка объектом с сообщением
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
                    clearTokens();
                }
            }
        }
    };

    // Проверяем наличие токена и получаем профиль при загрузке
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accessToken = getAccessToken();
                if (accessToken) {
                    await fetchUserProfile();
                }
            } catch (error) {
                console.error('Auth check error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Автоматическое обновление токена
    useEffect(() => {
        let refreshInterval: NodeJS.Timeout;

        const setupTokenRefresh = () => {
            const accessToken = getAccessToken();
            const refreshToken = getRefreshToken();

            if (accessToken && refreshToken) {
                try {
                    const payload = JSON.parse(atob(accessToken.split('.')[1]));
                    const expiryTime = payload.exp * 1000;
                    const currentTime = Date.now();

                    if (expiryTime - currentTime < 5 * 60 * 1000) {
                        apiRefreshToken();
                    }

                    refreshInterval = setInterval(async () => {
                        try {
                            const currentAccessToken = getAccessToken();
                            if (!currentAccessToken) {
                                clearInterval(refreshInterval);
                                return;
                            }

                            const payload = JSON.parse(atob(currentAccessToken.split('.')[1]));
                            const expiryTime = payload.exp * 1000;
                            const currentTime = Date.now();

                            if (expiryTime - currentTime < 5 * 60 * 1000) {
                                const success = await apiRefreshToken();
                                if (success) {
                                    await fetchUserProfile();
                                } else {
                                    clearInterval(refreshInterval);
                                }
                            }
                        } catch (error) {
                            console.error('Auto token check failed:', error);
                            clearInterval(refreshInterval);
                        }
                    }, 60 * 1000);

                } catch (error) {
                    console.error('Error parsing token:', error);
                }
            }
        };

        setupTokenRefresh();

        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, []);

    const login = async (tokens: LoginResponse | { access_token: string; refresh_token: string }): Promise<void> => {
        if ('token_type' in tokens) {
            saveTokens(tokens as LoginResponse);
        } else {
            saveAuthTokens(tokens.access_token, tokens.refresh_token);
        }

        await fetchUserProfile();
    };

    const logout = async (): Promise<void> => {
        try {
            await logoutApi();
        } catch (error) {
            console.error('Logout API error:', error);
        } finally {
            clearTokens();
            setUser(null);
        }
    };

    const refreshToken = async (): Promise<boolean> => {
        try {
            const success = await apiRefreshToken();
            if (success) {
                await fetchUserProfile();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token refresh error:', error);
            return false;
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        refreshToken,
        fetchUserProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};