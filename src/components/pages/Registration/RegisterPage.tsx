import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './RegisterPage.scss';
import { register } from '../../api/Registration/apiRegister';
import { RegisterRequest } from '../../types/auth';
import { FormData, FormErrors } from './utils/types/typesRegister';
import { validateForm, validateField } from './utils/validation/validationRegister';
import { useToast } from '../../widgets/toast/ToastProvider';

function RegisterPage() {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const [formData, setFormData] = useState<FormData>({
        first_name: '',
        last_name: '',
        email: '',
        organization_name: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});

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

        const registerData: RegisterRequest = {
            email: formData.email.trim(),
            first_name: formData.first_name.trim(),
            last_name: formData.last_name.trim(),
            password: formData.password,
            organization_name: formData.organization_name.trim() || undefined,
        };

        try {
            setIsLoading(true);
            console.log('Отправка запроса регистрации:', registerData);

            const response = await register(registerData);
            console.log('Регистрация успешна:', response);

            showToast('Регистрация успешна! Теперь вы можете войти в систему.', 'success', 4000);

            setTimeout(() => {
                navigate('/auth', {
                    state: {
                        message: 'Регистрация успешна! Теперь вы можете войти в систему.',
                        email: response.email
                    }
                });
            }, 1500);

        } catch (err) {
            console.error('Ошибка регистрации:', err);

            let errorMessage = 'Произошла ошибка при регистрации';
            if (err instanceof Error) {
                errorMessage = err.message;
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

        if (touched[name]) {
            const newErrors = validateField(name as keyof FormData, newValue, formData, errors);
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

        const newErrors = validateField(name as keyof FormData, fieldValue, formData, errors);
        setErrors(newErrors);
    };

    const getInputClassName = (fieldName: keyof FormErrors) => {
        const baseClass = "register-glass-input";
        const errorClass = errors[fieldName] ? "register-input-error" : "";
        return `${baseClass} ${errorClass}`.trim();
    };

    const getCheckboxClassName = () => {
        const baseClass = "register-checkbox-custom";
        const errorClass = errors.agreeTerms ? "register-checkbox-error" : "";
        return `${baseClass} ${errorClass}`.trim();
    };

    const renderInputField = (
        name: keyof FormData,
        label: string,
        type: string = 'text',
        placeholder: string,
        minLength?: number
    ) => {
        return (
            <div className="register-input-field">
                <label className="register-field-label">
                    {label} <span className="required-star">*</span>
                </label>
                <div className="register-input-container">
                    <input
                        type={type}
                        name={name}
                        value={formData[name] as string}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClassName(name)}
                        placeholder={placeholder}
                        disabled={isLoading}
                        minLength={minLength}
                    />
                </div>
                <div className="register-error-container">
                    {errors[name] && (
                        <div className="register-field-error">
                            {errors[name]}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const renderPasswordField = (
        name: keyof FormData,
        label: string,
        placeholder: string
    ) => {
        return (
            <div className="register-input-field">
                <label className="register-field-label">
                    {label} <span className="required-star">*</span>
                </label>
                <div className="register-input-container">
                    <input
                        type="password"
                        name={name}
                        value={formData[name] as string}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={getInputClassName(name)}
                        placeholder={placeholder}
                        disabled={isLoading}
                        minLength={6}
                    />
                </div>
                <div className="register-error-container">
                    {errors[name] ? (
                        <div className="register-field-error">
                            {errors[name]}
                        </div>
                    ) : (
                        name === 'password' && !errors.password && (
                            <p className="register-password-hint">Минимум 6 символов</p>
                        )
                    )}
                </div>
            </div>
        );
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
                    {renderInputField('first_name', 'Имя', 'text', 'Иван', 2)}

                    {renderInputField('last_name', 'Фамилия', 'text', 'Иванов', 2)}

                    {renderInputField('email', 'Электронная почта', 'email', 'you@example.com')}

                    {renderInputField('organization_name', 'Название организации', 'text', 'Ивашкино')}

                    {renderPasswordField('password', 'Пароль', '••••••••')}

                    {renderPasswordField('confirmPassword', 'Повторите пароль', '••••••••')}

                    <div className="register-form-options">
                        <label className="register-remember-me">
                            <input
                                type="checkbox"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={isLoading}
                            />
                            <span className={getCheckboxClassName()}></span>
                            Я согласен с пользовательским соглашением
                        </label>
                    </div>

                    <div className="register-checkbox-error-container">
                        {errors.agreeTerms && (
                            <div className="register-field-error checkbox-error">
                                {errors.agreeTerms}
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="register-submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Регистрация...' : 'Создать аккаунт'}
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