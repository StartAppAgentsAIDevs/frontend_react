import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.scss';

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

function RegisterPage() {
    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Проверка совпадения паролей
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        
        console.log('Registration form submitted:', formData);
        // Здесь будет логика регистрации
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="register-page">
            <Link to={'/'} className="register-header__title">
                <h2 className="register-header__title__text">SCHRIFT</h2>
            </Link>
            
            <div className="register-glass-form-container">
                <div className="register-form-header">
                    <h1 className="register-form-main-title">СОЗДАТЬ АККАУНТ</h1>
                    <p className="register-form-subtitle">Присоединяйтесь к нам для начала работы</p>
                </div>

                <form onSubmit={handleSubmit} className="register-glass-form">
                    <div className="register-input-field">
                        <label className="register-field-label">Имя пользователя</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="register-glass-input"
                            placeholder="john_doe"
                            required
                            minLength={3}
                        />
                    </div>

                    <div className="register-input-field">
                        <label className="register-field-label">Электронная почта</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="register-glass-input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="register-input-field">
                        <label className="register-field-label">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="register-glass-input"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                        <p className="register-password-hint">Должно быть 6 символов</p>
                    </div>

                    <div className="register-input-field">
                        <label className="register-field-label">Повторите пароль</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="register-glass-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="register-form-options">
                        <label className="register-remember-me">
                            <input type="checkbox" required />
                            <span className="register-checkbox-custom"></span>
                            Я согласен с пользовательским соглашением
                        </label>
                    </div>

                    <button type="submit" className="register-submit-button">
                        Создать аккаутн
                    </button>

                    <div className="register-divider">
                        <span>or</span>
                    </div>

                    <button type="button" className="register-google-button">
                        Войти через Google
                    </button>

                    <p className="register-signup-link">
                        У вас уже есть аккаунт?{' '}
                        <Link to="/auth" className="register-link-button">
                            Войти
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;