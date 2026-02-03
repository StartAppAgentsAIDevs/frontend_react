import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface User {
    email: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (tokens: { access_token: string; refresh_token: string }) => void;
    logout: () => void;
    refreshToken: () => Promise<boolean>;
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
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Проверяем наличие токена при загрузке
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const accessToken = localStorage.getItem('access_token');
                if (accessToken) {
                    // Можно добавить проверку валидности токена
                    const email = localStorage.getItem('user_email');
                    if (email) {
                        setUser({ email });
                    }
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
            const accessToken = localStorage.getItem('access_token');
            const rememberMe = localStorage.getItem('remember_me') === 'true';

            if (accessToken && rememberMe) {
                // Обновляем токен каждые 29 минут (токены обычно живут 30 мин)
                refreshInterval = setInterval(async () => {
                    try {
                        const success = await refreshToken();
                        if (!success) {
                            clearInterval(refreshInterval);
                        }
                    } catch (error) {
                        console.error('Auto token refresh failed:', error);
                        clearInterval(refreshInterval);
                    }
                }, 29 * 60 * 1000); // 29 минут
            }
        };

        setupTokenRefresh();

        return () => {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        };
    }, []);

    const login = (tokens: { access_token: string; refresh_token: string }) => {
        localStorage.setItem('access_token', tokens.access_token);
        localStorage.setItem('refresh_token', tokens.refresh_token);
        // Получаем email из токена (можно декодировать JWT)
        const tokenPayload = JSON.parse(atob(tokens.access_token.split('.')[1]));
        const email = tokenPayload.email || tokenPayload.sub;
        localStorage.setItem('user_email', email);
        setUser({ email });
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('remember_me');
        setUser(null);
    };

    const refreshToken = async (): Promise<boolean> => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                logout();
                return false;
            }

            const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                return true;
            } else {
                // Если refresh token невалиден, делаем логаут
                logout();
                return false;
            }
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
    };

    return <AuthContext.Provider value={ value }> { children } </AuthContext.Provider>;
};