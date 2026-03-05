import React, { useState, useEffect } from 'react';
import './Modal.scss';
import { updateUserProfile } from '../../../../api/getUser/apiUserData';
import { useToast } from '../../../../widgets/toast/ToastProvider';
import { UserProfile } from '../../../../types/userData';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: UserProfile;
    onSave: (updatedUser: UserProfile) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    user,
    onSave
}) => {
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        middle_name: user.middle_name || '',
        phone: user.phone || '',
        telegram_id: user.telegram_id || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            middle_name: user.middle_name || '',
            phone: user.phone || '',
            telegram_id: user.telegram_id || '',
        });
        setErrors({});
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
            newErrors.phone = 'Неверный формат телефона';
        }

        if (formData.telegram_id && !/^[a-zA-Z0-9_]+$/.test(formData.telegram_id)) {
            newErrors.telegram_id = 'Telegram ID может содержать только буквы, цифры и нижнее подчеркивание';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const updateData = {
                first_name: formData.first_name.trim() || null,
                last_name: formData.last_name.trim() || null,
                middle_name: formData.middle_name.trim() || null,
                phone: formData.phone.trim() || null,
                telegram_id: formData.telegram_id.trim() || null,
            };

            const updatedUser = await updateUserProfile(updateData);
            onSave(updatedUser);
            showToast('Профиль успешно обновлен!', 'success', 3000);
            onClose();

        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);

            let errorMessage = 'Произошла ошибка при обновлении профиля';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            showToast(errorMessage, 'error', 5000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                middle_name: user.middle_name || '',
                phone: user.phone || '',
                telegram_id: user.telegram_id || '',
            });
            setErrors({});
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal__overlay" onClick={handleClose} />

            <div className="modal__content">
                <div className="modal__header">
                    <h2 className="modal__title">Редактирование профиля</h2>
                    <button
                        className="modal__close"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        aria-label="Закрыть"
                    >
                        ×
                    </button>
                </div>

                <form className="modal__form" onSubmit={handleSubmit} noValidate>
                    <div className="modal__fields">
                        <div className="modal__field">
                            <label className="modal__label" htmlFor="last_name">
                                Фамилия
                            </label>
                            <input
                                id="last_name"
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="modal__input"
                                placeholder="Иванов"
                                disabled={isSubmitting}
                                maxLength={50}
                            />
                        </div>

                        <div className="modal__field">
                            <label className="modal__label" htmlFor="first_name">
                                Имя
                            </label>
                            <input
                                id="first_name"
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="modal__input"
                                placeholder="Иван"
                                disabled={isSubmitting}
                                maxLength={50}
                            />
                        </div>

                        <div className="modal__field">
                            <label className="modal__label" htmlFor="middle_name">
                                Отчество
                            </label>
                            <input
                                id="middle_name"
                                type="text"
                                name="middle_name"
                                value={formData.middle_name}
                                onChange={handleChange}
                                className="modal__input"
                                placeholder="Иванович"
                                disabled={isSubmitting}
                                maxLength={50}
                            />
                        </div>

                        <div className="modal__field">
                            <label className="modal__label" htmlFor="phone">
                                Телефон
                                <span className="modal__hint"> (необязательно)</span>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className={`modal__input ${errors.phone ? 'modal__input--error' : ''}`}
                                placeholder="+7 (999) 123-45-67"
                                disabled={isSubmitting}
                                maxLength={20}
                            />
                            {errors.phone && (
                                <div className="modal__error">
                                    {errors.phone}
                                </div>
                            )}
                        </div>

                        <div className="modal__field">
                            <label className="modal__label" htmlFor="telegram_id">
                                Telegram ID
                                <span className="modal__hint"> (необязательно)</span>
                            </label>
                            <input
                                id="telegram_id"
                                type="text"
                                name="telegram_id"
                                value={formData.telegram_id}
                                onChange={handleChange}
                                className={`modal__input ${errors.telegram_id ? 'modal__input--error' : ''}`}
                                placeholder="username"
                                disabled={isSubmitting}
                                maxLength={32}
                            />
                            {errors.telegram_id && (
                                <div className="modal__error">
                                    {errors.telegram_id}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="modal__actions">
                        <button
                            type="button"
                            className="modal__button modal__button--secondary"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="modal__button modal__button--primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Сохранение...' : 'Сохранить изменения'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;