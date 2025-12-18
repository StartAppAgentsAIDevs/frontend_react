import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import './AuthPage.scss';

interface FormData {
    email: string;
    password: string;
}

function AuthPage() {
    const [isLogin, setIsLogin] = useState<boolean>(true);
    const [formData, setFormData] = useState<FormData>({
        email: '',
        password: '',
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        // Здесь будет логика авторизации/регистрации
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="auth-page">
            <Link to={'/'} className="header__title">
                <h2 className="header__title__text">SCHRIFT</h2>
            </Link>
            {/* Форма по центру */}
            <div className="glass-form-container">
                <div className="form-header">
                    <h1 className="form-main-title">WELCOME BACK</h1>
                    <p className="form-subtitle">Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleSubmit} className="glass-form">
                    <div className="input-field">
                        <label className="field-label">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="glass-input"
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="input-field">
                        <label className="field-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="glass-input"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span className="checkbox-custom"></span>
                            Remember me
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="submit-button">
                        SIGN IN
                    </button>

                    <div className="divider">
                        <span>or</span>
                    </div>

                    <button type="button" className="google-button">
                        Continue with Google
                    </button>

                    <p className="signup-link">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            className="link-button"
                            onClick={() => setIsLogin(false)}
                        >
                            Sign up
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AuthPage;