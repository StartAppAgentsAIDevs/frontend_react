import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AuthPage.scss';
import { validateField, validateForm } from './utils/validation/validationAuth';
import { FormData, FormErrors } from './utils/types/typesAuth';
import { login, setCookie } from '../../api/Authorization/apiAuth';
import { useAuth } from '../../api/Authorization/authContext';
import { useToast } from '../../widgets/toast/ToastProvider';

function AuthPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();
    const { login: authLogin } = useAuth();

    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (location.state?.message) {
            showToast(location.state.message, 'success', 5000);

            if (location.state?.email) {
                setFormData(prev => ({
                    ...prev,
                    email: location.state.email
                }));
            }

            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate, showToast]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrors({});

        const newErrors = validateForm(formData);
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            const firstError = Object.values(newErrors)[0];
            if (firstError) {
                showToast(firstError, 'error', 4000);
            }

            const firstErrorField = Object.keys(newErrors)[0];
            if (firstErrorField) {
                const element = document.querySelector(`[name="${firstErrorField}"]`);
                if (element) {
                    (element as HTMLElement).focus();
                }
            }
            return;
        }

        try {
            setIsLoading(true);

            const response = await login({
                email: formData.email.trim(),
                password: formData.password,
            });

            await authLogin(response);

            if (formData.rememberMe) {
                setCookie('remember_me', 'true', 30);
            }

            showToast('Вы успешно вошли в систему!', 'success', 3000);

            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (err: unknown) {
            console.error('Ошибка авторизации:', err);

            let errorMessage = 'Произошла ошибка при авторизации';

            if (err instanceof Error) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            } else if (err && typeof err === 'object' && 'message' in err) {
                errorMessage = String((err as any).message);
            }

            showToast(errorMessage, 'error', 5000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData({
            ...formData,
            [name]: newValue
        });

        if (touched[name] && (name === 'email' || name === 'password')) {
            const newErrors = validateField(
                name as keyof FormData,
                newValue,
                formData,
                errors
            );
            setErrors(newErrors);
        }
    };

    const handleBlur = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        const fieldValue = type === 'checkbox' ? checked : value;

        setTouched(prev => ({
            ...prev,
            [name]: true
        }));

        if (name === 'email' || name === 'password') {
            const newErrors = validateField(
                name as keyof FormData,
                fieldValue,
                formData,
                errors
            );
            setErrors(newErrors);
        }
    };

    return (
        <div className="auth-page">
            <Link to={'/'} className="header__title_auth">
                <h2 className="header__title_auth__text">SCHRIFT</h2>
            </Link>

            <div className="glass-form-container">
                <div className="form-header">
                    <h1 className="form-main-title">С ВОЗВРАЩЕНИЕМ</h1>
                    <p className="form-subtitle">Войдите в аккаунт чтобы продолжить</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-form" noValidate>
                    <div className="input-field">
                        <label className="field-label">
                            Электронная почта <span className="required-star">*</span>
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`glass-input ${errors.email ? 'input-error' : ''}`}
                            placeholder="you@example.com"
                            disabled={isLoading}
                            autoComplete="email"
                        />
                        <div className="error-container">
                            {errors.email && (
                                <div className="error-message">
                                    {errors.email}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="input-field">
                        <label className="field-label">
                            Пароль <span className="required-star">*</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`glass-input ${errors.password ? 'input-error' : ''}`}
                            placeholder="••••••••"
                            disabled={isLoading}
                            minLength={6}
                            autoComplete="current-password"
                        />
                        <div className="error-container">
                            {errors.password ? (
                                <div className="error-message">
                                    {errors.password}
                                </div>
                            ) : (
                                <p className="password-hint">Минимум 6 символов</p>
                            )}
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isLoading}
                            />
                            <span className="checkbox-custom"></span>
                            Запомнить меня
                        </label>
                        <Link to="/forgot-password" className="forgot-password">
                            Забыли пароль?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Вход...' : 'Войти'}
                    </button>

                    <p className="signup-link">
                        Нету аккаунта?{' '}
                        <Link to="/register" className="link-button">
                            Зарегистрироваться
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default AuthPage;